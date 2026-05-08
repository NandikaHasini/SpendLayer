import type { AuditInput, AuditResult } from '@/types/audit'

export type ReportLoadState =
  | 'loading'
  | 'ready'
  | 'missing'
  | 'unavailable'
  | 'error'

export interface AuditReportRecord {
  id: string
  audit_input: AuditInput
  audit_result: AuditResult
  created_at: string
}

export interface ReportPersistenceResult {
  ok: boolean
  state: ReportLoadState
  message: string | null
}

export interface ReportFetchResult {
  ok: boolean
  state: ReportLoadState
  report: AuditResult | null
  message: string | null
}
