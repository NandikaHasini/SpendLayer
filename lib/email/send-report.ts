export interface AuditEmailPayload {
  recipientEmail: string
  companyName?: string
  totalMonthlySpend: number
  totalPotentialSavings: number
  recommendationCount: number
  criticalCount: number
  reportUrl: string
  auditDate: string
}

export interface SendReportEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function sendReportEmail(
  payload: AuditEmailPayload
): Promise<SendReportEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()

  if (!apiKey) {
    console.warn('RESEND_API_KEY is missing.')
    return {
      success: false,
      error: 'Email delivery is not configured.',
    }
  }

  const controller = new AbortController()

  const timeoutId = setTimeout(() => {
    controller.abort()
  }, 10_000)

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SpendLayer <onboarding@resend.dev>',
        to: payload.recipientEmail,
        subject: 'Your SpendLayer Audit Report',
        html: `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h1>SpendLayer Audit Report</h1>

            <p>
              ${
                payload.companyName
                  ? `Audit summary for <strong>${escapeHtml(payload.companyName)}</strong>.`
                  : 'Your audit summary is ready.'
              }
            </p>

            <ul>
              <li>
                Monthly Spend:
                <strong>$${payload.totalMonthlySpend.toFixed(2)}</strong>
              </li>

              <li>
                Potential Savings:
                <strong>$${payload.totalPotentialSavings.toFixed(2)}</strong>
              </li>

              <li>
                Recommendations:
                <strong>${payload.recommendationCount}</strong>
              </li>

              <li>
                Critical Recommendations:
                <strong>${payload.criticalCount}</strong>
              </li>

              <li>
                Audit Date:
                <strong>${escapeHtml(payload.auditDate)}</strong>
              </li>
            </ul>

            <p>
              <a
                href="${escapeHtml(payload.reportUrl)}"
                style="
                  display:inline-block;
                  padding:10px 16px;
                  background:#0f172a;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:8px;
                "
              >
                View Full Report
              </a>
            </p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      console.warn('Resend API request failed.', {
        status: response.status,
      })

      return {
        success: false,
        error: 'Unable to send report email right now.',
      }
    }

    let data: { id?: string }

    try {
      data = (await response.json()) as { id?: string }
    } catch {
      console.warn('Failed to parse Resend response JSON.')

      return {
        success: false,
        error: 'Invalid email delivery response.',
      }
    }

    return {
      success: true,
      messageId: data.id,
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('Resend request timed out.')

      return {
        success: false,
        error: 'Email delivery timed out.',
      }
    }

    console.warn('Unexpected email delivery failure.')

    return {
      success: false,
      error: 'Unable to send report email right now.',
    }
  } finally {
    clearTimeout(timeoutId)
  }
}