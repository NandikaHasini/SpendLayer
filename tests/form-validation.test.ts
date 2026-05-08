import { describe, it, expect } from 'vitest'
import {
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
  auditFormSchema,
} from '@/lib/audit/form-schema'

describe('stepOneSchema', () => {
  it('passes with valid use case and intensity', () => {
    const result = stepOneSchema.safeParse({
      primaryUseCase: 'coding',
      usageIntensity: 'moderate',
    })
    expect(result.success).toBe(true)
  })

  it('fails with missing primaryUseCase', () => {
    const result = stepOneSchema.safeParse({
      usageIntensity: 'moderate',
    })
    expect(result.success).toBe(false)
  })

  it('fails with invalid usageIntensity value', () => {
    const result = stepOneSchema.safeParse({
      primaryUseCase: 'coding',
      usageIntensity: 'extreme',
    })
    expect(result.success).toBe(false)
  })
})

describe('stepTwoSchema', () => {
  it('passes with valid team inputs', () => {
    const result = stepTwoSchema.safeParse({
      teamSize: 5,
      workflowType: 'small_team',
      overlappingSubscriptions: false,
    })
    expect(result.success).toBe(true)
  })

  it('fails when teamSize is zero', () => {
    const result = stepTwoSchema.safeParse({
      teamSize: 0,
      workflowType: 'small_team',
      overlappingSubscriptions: false,
    })
    expect(result.success).toBe(false)
  })

  it('fails with negative teamSize', () => {
    const result = stepTwoSchema.safeParse({
      teamSize: -1,
      workflowType: 'solo_developer',
      overlappingSubscriptions: false,
    })
    expect(result.success).toBe(false)
  })

  it('fails with invalid workflowType', () => {
    const result = stepTwoSchema.safeParse({
      teamSize: 3,
      workflowType: 'unknown_type',
      overlappingSubscriptions: false,
    })
    expect(result.success).toBe(false)
  })
})

describe('stepThreeSchema', () => {
  it('passes with at least one valid tool entry', () => {
    const result = stepThreeSchema.safeParse({
      tools: [
        { vendorId: 'chatgpt', planName: 'Plus', seats: 1, monthlySpend: 20 },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('fails with empty tools array', () => {
    const result = stepThreeSchema.safeParse({ tools: [] })
    expect(result.success).toBe(false)
  })

  it('shows a friendly message when tools are missing', () => {
    const result = stepThreeSchema.safeParse({})
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Please select at least one tool to continue.'
      )
    }
  })

  it('fails when tool has negative monthlySpend', () => {
    const result = stepThreeSchema.safeParse({
      tools: [
        { vendorId: 'chatgpt', planName: 'Plus', seats: 1, monthlySpend: -10 },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('fails when tool has zero seats', () => {
    const result = stepThreeSchema.safeParse({
      tools: [
        { vendorId: 'chatgpt', planName: 'Plus', seats: 0, monthlySpend: 20 },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('fails when vendorId is empty string', () => {
    const result = stepThreeSchema.safeParse({
      tools: [{ vendorId: '', planName: 'Plus', seats: 1, monthlySpend: 20 }],
    })
    expect(result.success).toBe(false)
  })
})

describe('auditFormSchema', () => {
  it('passes with complete valid inputs', () => {
    const result = auditFormSchema.safeParse({
      primaryUseCase: 'coding',
      usageIntensity: 'moderate',
      teamSize: 3,
      workflowType: 'small_team',
      overlappingSubscriptions: false,
      tools: [
        { vendorId: 'cursor', planName: 'Pro', seats: 3, monthlySpend: 60 },
      ],
      agreedToAudit: true,
    })
    expect(result.success).toBe(true)
  })

  it('fails when agreedToAudit is false', () => {
    const result = auditFormSchema.safeParse({
      primaryUseCase: 'coding',
      usageIntensity: 'moderate',
      teamSize: 1,
      workflowType: 'solo_developer',
      overlappingSubscriptions: false,
      tools: [
        { vendorId: 'chatgpt', planName: 'Plus', seats: 1, monthlySpend: 20 },
      ],
      agreedToAudit: false,
    })
    expect(result.success).toBe(false)
  })
})
