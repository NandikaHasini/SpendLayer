import type {
  AuditInput,
  AuditRecommendation,
  SelectedVendorInput,
} from '@/types/audit'
import {
  getVendorById,
  getPlanByName,
  getEffectiveMonthlyCost,
  getCheaperPlans,
} from '@/lib/pricing'

// ─── Rule: Overprovisioned plan for team size ─────────────────────────────────

export function applyDowngradeRule(
  tool: SelectedVendorInput,
  input: AuditInput
): Partial<AuditRecommendation> | null {
  const vendor = getVendorById(tool.vendorId)
  if (!vendor) return null

  const currentPlan = getPlanByName(tool.vendorId, tool.planName)
  if (!currentPlan) return null

  const currentCost = getEffectiveMonthlyCost(currentPlan, tool.seats)

  const isOverprovisioned =
    input.teamSize === 1 &&
    (tool.planName.toLowerCase().includes('team') ||
      tool.planName.toLowerCase().includes('business') ||
      tool.planName.toLowerCase().includes('enterprise'))

  if (!isOverprovisioned) return null

  const cheaperPlans = getCheaperPlans(tool.vendorId, tool.planName, tool.seats)
  if (cheaperPlans.length === 0) return null

  const bestDowngrade = cheaperPlans
    .filter((p) => p.bestFor.includes('solo_developer'))
    .sort((a, b) => getEffectiveMonthlyCost(b, 1) - getEffectiveMonthlyCost(a, 1))[0]

  if (!bestDowngrade) return null

  const optimizedCost = getEffectiveMonthlyCost(bestDowngrade, tool.seats)
  const monthlySavings = Math.max(0, currentCost - optimizedCost)

  if (monthlySavings < 5) return null

  return {
    recommendationType: 'DOWNGRADE',
    recommendedPlan: bestDowngrade.planName,
    recommendedAlternativeVendorId: null,
    recommendedAlternativeName: null,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    confidence: 'HIGH',
    reason: `You are on the ${tool.planName} plan but your team size is 1. Downgrading to ${bestDowngrade.planName} saves $${monthlySavings}/month without losing the features you need.`,
    switchingCostNote: 'Minimal — plan downgrade within the same product.',
  }
}

// ─── Rule: Redundancy detection ───────────────────────────────────────────────

export function applyRedundancyRule(
  tool: SelectedVendorInput,
  allTools: SelectedVendorInput[]
): Partial<AuditRecommendation> | null {
  const vendor = getVendorById(tool.vendorId)
  if (!vendor) return null

  const otherVendorIds = allTools
    .filter((t) => t.vendorId !== tool.vendorId)
    .map((t) => t.vendorId)

  const overlappingActive = vendor.overlaps.filter((id) =>
    otherVendorIds.includes(id)
  )

  if (overlappingActive.length === 0) return null

  const overlappingNames = overlappingActive
    .map((id) => getVendorById(id)?.name)
    .filter(Boolean)
    .join(', ')

  const currentPlan = getPlanByName(tool.vendorId, tool.planName)
  if (!currentPlan) return null
  const monthlyCost = getEffectiveMonthlyCost(currentPlan, tool.seats)
  if (monthlyCost === 0) return null

  return {
    recommendationType: 'REMOVE_REDUNDANCY',
    recommendedPlan: null,
    recommendedAlternativeVendorId: null,
    recommendedAlternativeName: null,
    monthlySavings: monthlyCost,
    annualSavings: monthlyCost * 12,
    confidence: 'MEDIUM',
    reason: `${vendor.name} heavily overlaps with ${overlappingNames} already in your stack. Evaluate whether you need both — consolidating could save $${monthlyCost}/month.`,
    switchingCostNote:
      'Medium — assess which tool better fits your primary workflow before cancelling.',
  }
}

// ─── Rule: Consolidation opportunity ─────────────────────────────────────────

export function applyConsolidationRule(
  tools: SelectedVendorInput[]
): Partial<AuditRecommendation> | null {
  const vendorIds = tools.map((t) => t.vendorId)
  const hasCopilot = vendorIds.includes('github_copilot')
  const hasChatGPT = vendorIds.includes('chatgpt')
  const hasCursor = vendorIds.includes('cursor')
  const hasWindsurf = vendorIds.includes('windsurf')

  if ((hasCopilot || hasChatGPT) && (hasCursor || hasWindsurf)) {
    return null
  }

  if (hasCopilot && hasChatGPT && !hasCursor && !hasWindsurf) {
    const copilotTool = tools.find((t) => t.vendorId === 'github_copilot')!
    const chatgptTool = tools.find((t) => t.vendorId === 'chatgpt')!
    const combinedSpend = copilotTool.monthlySpend + chatgptTool.monthlySpend
    const cursorProCost = 20

    const monthlySavings = Math.max(0, combinedSpend - cursorProCost)
    if (monthlySavings < 5) return null

    return {
      recommendationType: 'CONSOLIDATE',
      recommendedAlternativeVendorId: 'cursor',
      recommendedAlternativeName: 'Cursor',
      recommendedPlan: 'Pro',
      monthlySavings,
      annualSavings: monthlySavings * 12,
      confidence: 'MEDIUM',
      reason: `Cursor Pro ($20/seat) can replace both GitHub Copilot and ChatGPT for coding workflows, potentially saving $${monthlySavings}/month. It bundles code completion and AI chat in one editor.`,
      switchingCostNote:
        'Medium — requires adopting a new editor. Worth evaluating if your workflow is primarily coding.',
    }
  }

  return null
}

// ─── Rule: API usage (informational only — zero savings) ──────────────────────

export function applyAPIUsageRule(
  tool: SelectedVendorInput,
  input: AuditInput
): Partial<AuditRecommendation> | null {
  if (!['chatgpt', 'claude'].includes(tool.vendorId)) return null
  if (input.usageIntensity !== 'light') return null
  if (input.teamSize > 5) return null

  const currentPlan = getPlanByName(tool.vendorId, tool.planName)
  if (!currentPlan) return null

  const currentCost = getEffectiveMonthlyCost(currentPlan, tool.seats)
  if (currentCost === 0) return null

  return {
    recommendationType: 'API_USAGE',
    recommendedPlan: null,
    recommendedAlternativeVendorId: null,
    recommendedAlternativeName: null,
    monthlySavings: 0,
    annualSavings: 0,
    confidence: 'LOW',
    reason: `With light usage, direct API access to ${
      tool.vendorId === 'chatgpt' ? 'OpenAI' : 'Anthropic'
    } may cost less than a flat subscription. Evaluate your actual token usage to determine if API billing would be cheaper for your workflow.`,
    switchingCostNote:
      'Requires technical setup and usage monitoring. No savings are guaranteed without measuring your actual token consumption.',
  }
}

// ─── Rule: Already optimized ──────────────────────────────────────────────────

export function buildKeepRecommendation(
  tool: SelectedVendorInput
): Partial<AuditRecommendation> {
  const vendor = getVendorById(tool.vendorId)
  return {
    recommendationType: 'KEEP',
    recommendedPlan: null,
    recommendedAlternativeVendorId: null,
    recommendedAlternativeName: null,
    monthlySavings: 0,
    annualSavings: 0,
    confidence: 'HIGH',
    reason: `${vendor?.name ?? tool.vendorId} appears appropriately sized for your team and usage. No significant savings opportunity identified.`,
    switchingCostNote: null,
  }
}
