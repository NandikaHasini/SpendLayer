import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/email-report/route'
import { sendReportEmail } from '@/lib/email/send-report'
import type { AuditEmailPayload } from '@/lib/email/send-report'

const originalEnv = process.env
const originalFetch = global.fetch

const payload: AuditEmailPayload = {
  recipientEmail: 'founder@example.com',
  companyName: 'Acme',
  totalMonthlySpend: 1200,
  totalPotentialSavings: 300,
  recommendationCount: 4,
  criticalCount: 1,
  reportUrl: 'https://spendlayer.com/spend-report/abc',
  auditDate: 'May 9, 2026',
}

function jsonRequest(body: unknown): Request {
  return new Request('https://spendlayer.com/api/email-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

async function responseJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
  process.env = { ...originalEnv }
  global.fetch = vi.fn()
})

afterEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  process.env = originalEnv
  global.fetch = originalFetch
})

describe('sendReportEmail', () => {
  it('returns failure with a descriptive error when RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    const result = await sendReportEmail(payload)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Email delivery is not configured.')
    expect(global.fetch).not.toHaveBeenCalled()
    expect(warn).toHaveBeenCalledWith('RESEND_API_KEY is missing.')
  })

  it('returns success with messageId when fetch resolves with a Resend id', async () => {
    process.env.RESEND_API_KEY = 'test_key'
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'msg_abc123' }),
    } as Response)

    await expect(sendReportEmail(payload)).resolves.toEqual({
      success: true,
      messageId: 'msg_abc123',
    })
  })

  it('returns failure with status in the error message on non-ok response', async () => {
    process.env.RESEND_API_KEY = 'test_key'
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 422,
    } as Response)

    const result = await sendReportEmail(payload)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Unable to send report email right now.')
  })

  it('returns timeout failure when fetch rejects with AbortError', async () => {
    process.env.RESEND_API_KEY = 'test_key'
    vi.mocked(global.fetch).mockRejectedValue(
      Object.assign(new Error('aborted'), { name: 'AbortError' })
    )

    const result = await sendReportEmail(payload)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/timed out/i)
  })

  it('returns a non-empty error when fetch rejects with a generic error', async () => {
    process.env.RESEND_API_KEY = 'test_key'
    vi.mocked(global.fetch).mockRejectedValue(new Error('fetch failed'))

    const result = await sendReportEmail(payload)

    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('returns success without messageId when ok response json parsing throws', async () => {
    process.env.RESEND_API_KEY = 'test_key'
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error('bad json')
      },
    } as Response)

    await expect(sendReportEmail(payload)).resolves.toEqual({
      success: false,
      error: 'Invalid email delivery response.',
    })
  })
})

describe('POST /api/email-report', () => {
  it('returns 400 when recipientEmail is empty', async () => {
    const response = await POST(jsonRequest({ ...payload, recipientEmail: '' }))

    expect(response.status).toBe(400)
    await expect(responseJson(response)).resolves.toEqual({
      error: 'A valid email address is required.',
    })
  })

  it('returns 400 when recipientEmail is invalid', async () => {
    const response = await POST(jsonRequest({ ...payload, recipientEmail: 'not-an-email' }))

    expect(response.status).toBe(400)
    await expect(responseJson(response)).resolves.toEqual({
      error: 'A valid email address is required.',
    })
  })

  it('returns 400 when body is invalid JSON', async () => {
    const response = await POST(
      new Request('https://spendlayer.com/api/email-report', {
        method: 'POST',
        body: 'not-json{{{',
      })
    )

    expect(response.status).toBe(400)
    await expect(responseJson(response)).resolves.toEqual({
      error: 'Invalid request body.',
    })
  })

  it('returns 200 success false when RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    const response = await POST(jsonRequest(payload))
    const json = await responseJson(response)

    expect(response.status).toBe(200)
    expect(json.success).toBe(false)
    expect(json.error).toBe('Email delivery is not configured.')
  })

  it('returns 200 success true when fetch resolves with a Resend response', async () => {
    process.env.RESEND_API_KEY = 'test_key'
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'msg_abc123' }),
    } as Response)

    const response = await POST(jsonRequest(payload))
    const json = await responseJson(response)

    expect(response.status).toBe(200)
    expect(json).toEqual({ success: true, messageId: 'msg_abc123' })
  })

  it('allows missing companyName and proceeds to delivery', async () => {
    process.env.RESEND_API_KEY = 'test_key'
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'msg_abc123' }),
    } as Response)

    const withoutCompanyName = { ...payload, companyName: undefined }
    const response = await POST(jsonRequest(withoutCompanyName))

    expect(response.status).toBe(200)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})
