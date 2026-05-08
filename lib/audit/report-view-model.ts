import type {
  AuditRecommendation,
  AuditResult,
  RecommendationType,
} from '@/types/audit'

export const RECOMMENDATION_LABELS: Record<RecommendationType, string> = {
  KEEP: 'Keep',
  DOWNGRADE: 'Downgrade',
  CONSOLIDATE: 'Consolidate',
  SWITCH: 'Switch',
  API_USAGE: 'API usage',
  REMOVE_REDUNDANCY: 'Remove redundancy',
}

export function getRenderableReportResult(
  auditResult: AuditResult | null,
  storedAuditId: string | null,
  routeAuditId: string
): AuditResult | null {
  if (!auditResult || storedAuditId !== routeAuditId) return null
  return auditResult
}

export function getRecommendationTarget(rec: AuditRecommendation): string {
  if (rec.recommendedPlan) return rec.recommendedPlan
  if (rec.recommendedAlternativeName) return rec.recommendedAlternativeName
  return 'No plan change'
}

export function getReportFallbackCopy(
  state: 'loading' | 'ready' | 'missing' | 'unavailable' | 'error',
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
