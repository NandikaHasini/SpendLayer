import { z } from 'zod'

export const toolEntrySchema = z.object({
  vendorId: z.string().min(1, 'Please select a tool'),
  planName: z.string().min(1, 'Please select a plan'),
  seats: z
    .number({ error: 'Seats must be a number' })
    .int('Seats must be a whole number')
    .min(1, 'At least 1 seat required')
    .max(10000, 'Maximum 10,000 seats'),
  monthlySpend: z
    .number({ error: 'Spend must be a number' })
    .min(0, 'Spend cannot be negative')
    .max(1000000, 'Maximum spend exceeded'),
})

export const stepOneSchema = z.object({
  primaryUseCase: z.enum(
    ['coding', 'writing', 'research', 'customer_support', 'data_analysis', 'general'],
    { error: 'Please select your primary use case' }
  ),
  usageIntensity: z.enum(['light', 'moderate', 'heavy'], {
    error: 'Please select your usage intensity',
  }),
})

export const stepTwoSchema = z.object({
  teamSize: z
    .number({ error: 'Team size must be a number' })
    .int('Team size must be a whole number')
    .min(1, 'Team size must be at least 1')
    .max(100000, 'Maximum team size exceeded'),
  workflowType: z.enum(
    ['solo_developer', 'small_team', 'mid_team', 'large_team'],
    { error: 'Please select your workflow type' }
  ),
  overlappingSubscriptions: z.boolean(),
})

export const stepThreeSchema = z.object({
  tools: z
    .array(toolEntrySchema, {
      error: 'Please select at least one tool to continue.',
    })
    .min(1, 'Please select at least one tool to continue.')
    .max(20, 'Maximum 20 tools allowed'),
})

export const auditFormSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema)
  .extend({
    agreedToAudit: z.literal(true, {
      error: 'Please confirm to generate your audit',
    }),
  })

export type AuditFormSchema = z.infer<typeof auditFormSchema>
