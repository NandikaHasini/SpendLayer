import type {
  AuditInput,
  AuditRecommendation,
  AuditResult,
} from '@/types/audit'
import { getVendorById } from '@/lib/pricing'
import {
  applyDowngradeRule,
  applyRedundancyRule,
  applyConsolidationRule,
  applyAPIUsageRule,
  buildKeepRecommendation,
} from './rules'
import {
  computeSavingsBreakdown,
  computeTotalCurrentSpend,
  isSavingsSignificant,
} from './calculator'

interface RunAuditOptions {
  generatedAt?: string
}

export function runAudit(input: AuditInput, options?: RunAuditOptions): AuditResult {
  const recommendations: AuditRecommendation[] = []
  const toolSavings: number[] = []
  const currentSpends: number[] = input.tools.map((t) => t.monthlySpend)

  const consolidationResult = applyConsolidationRule(input.tools)

  for (const tool of input.tools) {
    const vendor = getVendorById(tool.vendorId)
    const vendorName = vendor?.name ?? tool.vendorId

    const downgrade = applyDowngradeRule(tool, input)
    const redundancy = applyRedundancyRule(tool, input.tools)
    const infoRule = applyAPIUsageRule(tool, input)

    // Priority: downgrade > redundancy > keep
    const appliedRule = downgrade ?? redundancy ?? null

    if (appliedRule && isSavingsSignificant(appliedRule.monthlySavings ?? 0)) {
      recommendations.push({
        vendorId: tool.vendorId,
        vendorName,
        currentPlan: tool.planName,
        currentMonthlySpend: tool.monthlySpend,
        recommendedAlternativeVendorId: appliedRule.recommendedAlternativeVendorId ?? null,
        recommendedAlternativeName: appliedRule.recommendedAlternativeName ?? null,
        ...appliedRule,
      } as AuditRecommendation)
      toolSavings.push(appliedRule.monthlySavings ?? 0)
    } else if (infoRule) {
      // API_USAGE is informational only — push with zero savings, no threshold check
      recommendations.push({
        vendorId: tool.vendorId,
        vendorName,
        currentPlan: tool.planName,
        currentMonthlySpend: tool.monthlySpend,
        recommendedAlternativeVendorId: null,
        recommendedAlternativeName: null,
        ...infoRule,
      } as AuditRecommendation)
      toolSavings.push(0)
    } else if (
      consolidationResult &&
      isSavingsSignificant(consolidationResult.monthlySavings ?? 0) &&
      !recommendations.some((r) => r.recommendationType === 'CONSOLIDATE')
    ) {
      recommendations.push({
        vendorId: tool.vendorId,
        vendorName,
        currentPlan: tool.planName,
        currentMonthlySpend: tool.monthlySpend,
        recommendedAlternativeVendorId: consolidationResult.recommendedAlternativeVendorId ?? null,
        recommendedAlternativeName: consolidationResult.recommendedAlternativeName ?? null,
        ...consolidationResult,
      } as AuditRecommendation)
      toolSavings.push(consolidationResult.monthlySavings ?? 0)
    } else {
      recommendations.push({
        vendorId: tool.vendorId,
        vendorName,
        currentPlan: tool.planName,
        currentMonthlySpend: tool.monthlySpend,
        ...buildKeepRecommendation(tool),
      } as AuditRecommendation)
      toolSavings.push(0)
    }
  }

  const totalCurrentSpend = computeTotalCurrentSpend(currentSpends)
  const totalMonthlySavings = toolSavings.reduce((sum, s) => sum + s, 0)
  const totalOptimizedSpend = Math.max(0, totalCurrentSpend - totalMonthlySavings)
  const savings = computeSavingsBreakdown(totalCurrentSpend, totalOptimizedSpend)

  return {
    recommendations,
    savings,
    totalCurrentSpend,
    totalOptimizedSpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    hasSignificantSavings: totalMonthlySavings >= 20,
    summary: null,
    generatedAt: options?.generatedAt ?? new Date().toISOString(),
  }
}
