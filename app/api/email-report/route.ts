import { NextResponse } from 'next/server'
import { sendReportEmail } from '@/lib/email/send-report'
import type { AuditEmailPayload } from '@/lib/email/send-report'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isNonNegativeFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function defaultAuditDate(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    )
  }

  const input = body as Record<string, unknown>

  const recipientEmail =
    typeof input.recipientEmail === 'string'
      ? input.recipientEmail.trim()
      : ''

  if (
    !recipientEmail ||
    recipientEmail.length > 320 ||
    !EMAIL_PATTERN.test(recipientEmail)
  ) {
    return NextResponse.json(
      { error: 'A valid email address is required.' },
      { status: 400 }
    )
  }

  let companyName: string | undefined

  if (typeof input.companyName === 'string') {
    const trimmed = input.companyName.trim()

    if (trimmed.length > 200) {
      return NextResponse.json(
        { error: 'Company name is too long.' },
        { status: 400 }
      )
    }

    companyName = trimmed || undefined
  }

  if (
    !isNonNegativeFiniteNumber(input.totalMonthlySpend) ||
    !isNonNegativeFiniteNumber(input.totalPotentialSavings) ||
    !isNonNegativeFiniteNumber(input.recommendationCount) ||
    !isNonNegativeFiniteNumber(input.criticalCount)
  ) {
    return NextResponse.json(
      { error: 'Invalid audit summary data.' },
      { status: 400 }
    )
  }

  const reportUrl =
    typeof input.reportUrl === 'string'
      ? input.reportUrl.trim()
      : ''

  if (!reportUrl.startsWith('http') || reportUrl.length > 2048) {
    return NextResponse.json(
      { error: 'A valid report URL is required.' },
      { status: 400 }
    )
  }

  const auditDate =
    typeof input.auditDate === 'string' && input.auditDate.trim()
      ? input.auditDate.trim()
      : defaultAuditDate()

  const payload: AuditEmailPayload = {
    recipientEmail,
    companyName,
    totalMonthlySpend: input.totalMonthlySpend,
    totalPotentialSavings: input.totalPotentialSavings,
    recommendationCount: input.recommendationCount,
    criticalCount: input.criticalCount,
    reportUrl,
    auditDate,
  }

  const result = await sendReportEmail(payload)

  if (!result.success) {
    return NextResponse.json({
      success: false,
      error: result.error,
    })
  }

  return NextResponse.json({
    success: true,
    messageId: result.messageId,
  })
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed.' },
    { status: 405 }
  )
}