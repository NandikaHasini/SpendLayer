// ─── Vendor & Pricing ────────────────────────────────────────────────────────

export type VendorCategory =
  | 'ai_assistant'
  | 'ai_coding'
  | 'ai_search'
  | 'ai_platform'

export type UsageIntensity = 'light' | 'moderate' | 'heavy'

export type WorkflowType =
  | 'solo_developer'
  | 'small_team'
  | 'mid_team'
  | 'large_team'

export type PrimaryUseCase =
  | 'coding'
  | 'writing'
  | 'research'
  | 'customer_support'
  | 'data_analysis'
  | 'general'

// ─── Recommendation Types ─────────────────────────────────────────────────────

export type RecommendationType =
  | 'KEEP'
  | 'DOWNGRADE'
  | 'CONSOLIDATE'
  | 'SWITCH'
  | 'API_USAGE'
  | 'REMOVE_REDUNDANCY'

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW'

// ─── Pricing Data ─────────────────────────────────────────────────────────────

export interface ToolPlan {
  planName: string
  monthlyPricePerSeat: number
  flatMonthlyPrice: number | null
  annualMonthlyEquivalent: number | null
  maxSeats: number | null
  minSeats: number | null
  features: string[]
  bestFor: WorkflowType[]
  sourceUrl: string
  lastVerified: string
  notes: string | null
}

export interface Vendor {
  id: string
  name: string
  category: VendorCategory
  description: string
  plans: ToolPlan[]
  overlaps: string[]
}

// ─── Audit Input ──────────────────────────────────────────────────────────────

export interface SelectedVendorInput {
  vendorId: string
  planName: string
  seats: number
  monthlySpend: number
}

export interface AuditInput {
  tools: SelectedVendorInput[]
  teamSize: number
  workflowType: WorkflowType
  usageIntensity: UsageIntensity
  primaryUseCase: PrimaryUseCase
  overlappingSubscriptions: boolean
}

// ─── Audit Output ─────────────────────────────────────────────────────────────

export interface SavingsBreakdown {
  currentMonthlySpend: number
  optimizedMonthlySpend: number
  monthlySavings: number
  annualSavings: number
  savingsPercentage: number
}

export interface AuditRecommendation {
  vendorId: string
  vendorName: string
  currentPlan: string
  currentMonthlySpend: number
  recommendationType: RecommendationType
  recommendedPlan: string | null
  recommendedAlternativeVendorId: string | null
  recommendedAlternativeName: string | null
  monthlySavings: number
  annualSavings: number
  confidence: ConfidenceLevel
  reason: string
  switchingCostNote: string | null
}

export interface AuditResult {
  recommendations: AuditRecommendation[]
  savings: SavingsBreakdown
  totalCurrentSpend: number
  totalOptimizedSpend: number
  totalMonthlySavings: number
  totalAnnualSavings: number
  hasSignificantSavings: boolean
  summary: string | null
  generatedAt: string
}
