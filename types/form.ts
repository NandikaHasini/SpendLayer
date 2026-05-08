import type {
  WorkflowType,
  UsageIntensity,
  PrimaryUseCase,
} from '@/types/audit'

export interface ToolFormEntry {
  vendorId: string
  planName: string
  seats: number
  monthlySpend: number
}

export interface AuditFormValues {
  // Step 1 - Usage profile
  primaryUseCase: PrimaryUseCase
  usageIntensity: UsageIntensity

  // Step 2 - Team context
  teamSize: number
  workflowType: WorkflowType
  overlappingSubscriptions: boolean

  // Step 3 - Tool entries
  tools: ToolFormEntry[]

  // Step 4 - Confirmation
  agreedToAudit: boolean
}

export type FormStep = 1 | 2 | 3 | 4 | 5

export interface AuditFormState {
  currentStep: FormStep
  values: Partial<AuditFormValues>
  isSubmitting: boolean
  lastSavedAt: string | null
}
