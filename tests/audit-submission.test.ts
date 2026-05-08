import { describe, it, expect } from 'vitest'
import { runAudit } from '@/lib/audit/engine'
import type { AuditInput } from '@/types/audit'

const validFormInput: AuditInput = {
  teamSize: 1,
  workflowType: 'solo_developer',
  usageIntensity: 'moderate',
  primaryUseCase: 'coding',
  overlappingSubscriptions: false,
  tools: [
    { vendorId: 'chatgpt', planName: 'Plus', seats: 1, monthlySpend: 20 },
    { vendorId: 'cursor', planName: 'Pro', seats: 1, monthlySpend: 20 },
  ],
}

describe('Audit submission integration', () => {
  it('produces a valid AuditResult from form-like input', () => {
    const result = runAudit(validFormInput)
    expect(result).toBeDefined()
    expect(result.recommendations).toBeInstanceOf(Array)
    expect(result.totalCurrentSpend).toBe(40)
    expect(result.generatedAt).toBeTruthy()
  })

  it('generates a recommendation for every tool submitted', () => {
    const result = runAudit(validFormInput)
    expect(result.recommendations.length).toBe(validFormInput.tools.length)
  })

  it('hasSignificantSavings is boolean', () => {
    const result = runAudit(validFormInput)
    expect(typeof result.hasSignificantSavings).toBe('boolean')
  })

  it('produces correct savings structure', () => {
    const result = runAudit(validFormInput)
    expect(result.savings).toHaveProperty('monthlySavings')
    expect(result.savings).toHaveProperty('annualSavings')
    expect(result.savings).toHaveProperty('savingsPercentage')
    expect(result.savings.monthlySavings).toBeGreaterThanOrEqual(0)
  })

  it('handles solo user on team plan correctly', () => {
    const input: AuditInput = {
      teamSize: 1,
      workflowType: 'solo_developer',
      usageIntensity: 'moderate',
      primaryUseCase: 'coding',
      overlappingSubscriptions: false,
      tools: [
        { vendorId: 'chatgpt', planName: 'Team', seats: 1, monthlySpend: 30 },
      ],
    }
    const result = runAudit(input)
    expect(result.recommendations[0].recommendationType).toBe('DOWNGRADE')
    expect(result.totalMonthlySavings).toBeGreaterThan(0)
  })

  it('handles empty tools gracefully', () => {
    const input: AuditInput = {
      ...validFormInput,
      tools: [],
    }
    const result = runAudit(input)
    expect(result.recommendations).toHaveLength(0)
    expect(result.totalCurrentSpend).toBe(0)
    expect(result.hasSignificantSavings).toBe(false)
  })
})
