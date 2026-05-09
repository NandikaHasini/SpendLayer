import type { AuditResult } from '@/types/audit'

export function buildFallbackSummary(result: AuditResult): string {
  const {
    totalCurrentSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    hasSignificantSavings,
  } = result

  if (!hasSignificantSavings) {
    return `Your current AI tooling spend of $${totalCurrentSpend}/month appears well-optimized for your team size and workflow. No significant savings opportunities were identified based on current pricing data.`
  }

  return `Your audit identified $${totalMonthlySavings}/month ($${totalAnnualSavings}/year) in potential savings from your current $${totalCurrentSpend}/month AI tooling spend. Review the recommendations below to understand which plan changes or consolidations could reduce your costs.`
}
