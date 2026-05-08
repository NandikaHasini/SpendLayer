import { describe, expect, it, vi, afterEach } from 'vitest'
import { runAudit } from '@/lib/audit/engine'
import {
  buildAuditReportRecord,
  fetchAuditReportFromSupabase,
  getReportFallbackCopy,
  getSupabaseReportEnvStatus,
  saveAuditReportToSupabase,
} from '@/lib/report-storage'
import { persistReportViaApi } from '@/lib/report-client'
import type { AuditInput } from '@/types/audit'

const input: AuditInput = {
  teamSize: 1,
  workflowType: 'solo_developer',
  usageIntensity: 'moderate',
  primaryUseCase: 'coding',
  overlappingSubscriptions: false,
  tools: [
    { vendorId: 'chatgpt', planName: 'Team', seats: 1, monthlySpend: 30 },
  ],
}

const auditResult = runAudit(input, {
  generatedAt: '2026-01-01T00:00:00.000Z',
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('report storage helpers', () => {
  it('builds a stable report record payload', () => {
    const record = buildAuditReportRecord('abc123', input, auditResult)

    expect(record.id).toBe('abc123')
    expect(record.audit_input).toBe(input)
    expect(record.audit_result).toBe(auditResult)
    expect(record.created_at).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    )
  })

  it('reports missing Supabase env vars safely', () => {
    const status = getSupabaseReportEnvStatus({
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
      SUPABASE_SERVICE_ROLE_KEY: '',
    } as NodeJS.ProcessEnv)

    expect(status.configured).toBe(false)
    expect(status.missing).toContain('NEXT_PUBLIC_SUPABASE_URL')
    expect(status.missing).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    expect(status.missing).toContain('SUPABASE_SERVICE_ROLE_KEY')
  })

  it('returns friendly loading and fallback copy', () => {
    expect(getReportFallbackCopy('loading').title).toBe('Loading audit report...')
    expect(getReportFallbackCopy('missing').title).toBe('No audit result found.')
    expect(getReportFallbackCopy('unavailable').title).toBe(
      'Report unavailable right now.'
    )
  })

  it('returns unavailable when persistence env is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '')

    const result = await saveAuditReportToSupabase('abc123', input, auditResult)
    expect(result.ok).toBe(false)
    expect(result.state).toBe('unavailable')
  })

  it('returns unavailable when fetch env is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '')

    const result = await fetchAuditReportFromSupabase('abc123')
    expect(result.ok).toBe(false)
    expect(result.state).toBe('unavailable')
  })
})

describe('report client helper', () => {
  it('returns a friendly failure when the request fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'))
    vi.stubGlobal('fetch', fetchMock)

    const result = await persistReportViaApi('abc123', input, auditResult)

    expect(result.ok).toBe(false)
    expect(result.message).toBe('Report persistence is unavailable.')
  })

  it('returns success when the API reports ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await persistReportViaApi('abc123', input, auditResult)

    expect(result.ok).toBe(true)
    expect(result.message).toBeNull()
  })
})
