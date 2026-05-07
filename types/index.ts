export type UseCase =
  | 'marketing'
  | 'engineering'
  | 'design'
  | 'operations'
  | 'sales'
  | 'general'

export type RecommendedAction = 'downgrade' | 'switch' | 'keep' | 'consolidate'

export type ConfidenceLevel = 'high' | 'medium'

export interface ToolPlan {
  planName: string
  monthlyPricePerSeat: number
  flatMonthlyPrice: number | null
  maxSeats: number | null
  features: string[]
  sourceUrl: string
  lastVerified: string
}

export interface SupportedTool {
  id: string
  name: string
  category: string
  logoUrl: string
  plans: ToolPlan[]
  useCases: UseCase[]
}

export interface SelectedTool {
  toolId: string
  planName: string
  seats: number
  monthlySpend: number
}

export interface AuditInput {
  tools: SelectedTool[]
  teamSize: number
  useCase: UseCase
}

export interface ToolRecommendation {
  toolId: string
  toolName: string
  currentPlan: string
  currentMonthlySpend: number
  recommendedAction: RecommendedAction
  recommendedPlan: string | null
  recommendedAlternative: string | null
  monthlySavings: number
  annualSavings: number
  reason: string
  confidence: ConfidenceLevel
}

export interface AuditResult {
  recommendations: ToolRecommendation[]
  totalCurrentSpend: number
  totalOptimizedSpend: number
  totalMonthlySavings: number
  totalAnnualSavings: number
  summary: string | null
}

export interface AuditRecord {
  id: string
  tool_data: SelectedTool[]
  team_size: number
  use_case: UseCase
  monthly_savings: number
  annual_savings: number
  summary: string | null
  created_at: string
}

export interface LeadRecord {
  id: string
  email: string
  company: string | null
  role: string | null
  audit_id: string
  created_at: string
}
