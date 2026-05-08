'use client'

import type { AuditInput, AuditResult } from '@/types/audit'

export interface ReportWriteResponse {
  ok: boolean
  message: string | null
}

const REPORT_WRITE_TIMEOUT_MS = 4000

export async function persistReportViaApi(
  id: string,
  auditInput: AuditInput,
  auditResult: AuditResult
): Promise<ReportWriteResponse> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REPORT_WRITE_TIMEOUT_MS)

  try {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        auditInput,
        auditResult,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null
      return {
        ok: false,
        message: payload?.message ?? 'Report persistence failed.',
      }
    }

    return {
      ok: true,
      message: null,
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        ok: false,
        message: 'Report persistence timed out.',
      }
    }

    return {
      ok: false,
      message: 'Report persistence is unavailable.',
    }
  } finally {
    clearTimeout(timeout)
  }
}
