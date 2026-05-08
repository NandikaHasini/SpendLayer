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
