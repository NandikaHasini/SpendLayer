import { createClient } from '@supabase/supabase-js'
import type { AuditInput, AuditResult } from '@/types/audit'
import type {
  AuditReportRecord,
  ReportFetchResult,
  ReportLoadState,
  ReportPersistenceResult,
} from '@/types/report'

const REPORTS_TABLE = 'audit_reports'
const SUPABASE_TIMEOUT_MS = 4000

type SupabaseWriteResponse = {
  error: { message: string } | null
}

type SupabaseFetchRow = {
  id: string
  audit_input: AuditInput
  audit_result: unknown
  created_at: string
}

type SupabaseFetchResponse = {
  data: SupabaseFetchRow | null
  error: { message: string } | null
}

export function getSupabaseReportEnvStatus(
  env: NodeJS.ProcessEnv = process.env
): { configured: boolean; missing: string[] } {
  const missing: string[] = []

  if (!env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  if (!env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY')

  return {
    configured: missing.length === 0,
    missing,
  }
}

export function buildAuditReportRecord(
  id: string,
  auditInput: AuditInput,
  auditResult: AuditResult
): AuditReportRecord {
  return {
    id,
    audit_input: auditInput,
    audit_result: auditResult,
    created_at: new Date().toISOString(),
  }
}

export function getReportFallbackCopy(
  state: ReportLoadState,
  detail?: string | null
): { title: string; message: string } {
  if (state === 'missing') {
    return {
      title: 'No audit result found.',
      message:
        detail ?? 'Run a new audit to generate deterministic savings recommendations.',
    }
  }

  if (state === 'unavailable') {
    return {
      title: 'Report unavailable right now.',
      message:
        detail ??
        'The report could not be loaded from storage. Try again in a moment.',
    }
  }

  if (state === 'error') {
    return {
      title: 'Unable to load report.',
      message:
        detail ?? 'Something went wrong while loading the audit report.',
    }
  }

  return {
    title: 'Loading audit report...',
    message: detail ?? 'Please wait while the report loads.',
  }
}

function createSupabaseAdminClient() {
  const envStatus = getSupabaseReportEnvStatus()
  if (!envStatus.configured) return null

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function withTimeout<T>(
  promise: T | PromiseLike<T>,
  timeoutMs = SUPABASE_TIMEOUT_MS
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  try {
    return await Promise.race([
      Promise.resolve(promise),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('Supabase request timed out'))
        }, timeoutMs)
      }),
    ])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

export async function saveAuditReportToSupabase(
  id: string,
  auditInput: AuditInput,
  auditResult: AuditResult
): Promise<ReportPersistenceResult> {
  const envStatus = getSupabaseReportEnvStatus()
  if (!envStatus.configured) {
    return {
      ok: false,
      state: 'unavailable',
      message: `Missing Supabase env vars: ${envStatus.missing.join(', ')}`,
    }
  }

  const client = createSupabaseAdminClient()
  if (!client) {
    return {
      ok: false,
      state: 'unavailable',
      message: 'Supabase client could not be initialized.',
    }
  }

  const report = buildAuditReportRecord(id, auditInput, auditResult)
  const { error } = (await withTimeout(
    client.from(REPORTS_TABLE).upsert(
      report,
      { onConflict: 'id' }
    )
  )) as SupabaseWriteResponse

  if (error) {
    return {
      ok: false,
      state: 'error',
      message: error.message,
    }
  }

  return {
    ok: true,
    state: 'ready',
    message: null,
  }
}

function isAuditResult(value: unknown): value is AuditResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as AuditResult).recommendations) &&
    typeof (value as AuditResult).totalCurrentSpend === 'number' &&
    typeof (value as AuditResult).totalOptimizedSpend === 'number' &&
    typeof (value as AuditResult).totalMonthlySavings === 'number' &&
    typeof (value as AuditResult).totalAnnualSavings === 'number'
  )
}

export async function fetchAuditReportFromSupabase(
  id: string
): Promise<ReportFetchResult> {
  const envStatus = getSupabaseReportEnvStatus()
  if (!envStatus.configured) {
    return {
      ok: false,
      state: 'unavailable',
      report: null,
      message: `Missing Supabase env vars: ${envStatus.missing.join(', ')}`,
    }
  }

  const client = createSupabaseAdminClient()
  if (!client) {
    return {
      ok: false,
      state: 'unavailable',
      report: null,
      message: 'Supabase client could not be initialized.',
    }
  }

  const { data, error } = (await withTimeout(
    client
      .from(REPORTS_TABLE)
      .select('id, audit_input, audit_result, created_at')
      .eq('id', id)
      .maybeSingle()
  )) as SupabaseFetchResponse

  if (error) {
    if (error.message.toLowerCase().includes('timed out')) {
      return {
        ok: false,
        state: 'unavailable',
        report: null,
        message: 'Report loading timed out. Please try again.',
      }
    }

    return {
      ok: false,
      state: 'error',
      report: null,
      message: 'Unable to load the report right now.',
    }
  }

  if (!data) {
    return {
      ok: false,
      state: 'missing',
      report: null,
      message: null,
    }
  }

  if (!isAuditResult(data.audit_result)) {
    return {
      ok: false,
      state: 'error',
      report: null,
      message: 'Stored report data is invalid.',
    }
  }

  return {
    ok: true,
    state: 'ready',
    report: data.audit_result,
    message: null,
  }
}
