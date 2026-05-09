import { describe, it, expect } from 'vitest'
import { buildFallbackSummary } from '@/lib/ai/summary-fallback'
import type { AuditResult } from '@/types/audit'

function makeResult(overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    recommendations: [],
    savings: {
      currentMonthlySpend: 100,
      optimizedMonthlySpend: 70,
      monthlySavings: 30,
      annualSavings: 360,
      savingsPercentage: 30,
    },
    totalCurrentSpend: 100,
    totalOptimizedSpend: 70,
    totalMonthlySavings: 30,
    totalAnnualSavings: 360,
    hasSignificantSavings: true,
    summary: null,
    generatedAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('buildFallbackSummary', () => {
  it('returns a non-empty string for any valid result', () => {
    const result = makeResult()
    const summary = buildFallbackSummary(result)
    expect(typeof summary).toBe('string')
    expect(summary.length).toBeGreaterThan(10)
  })

  it('mentions current spend amount when savings exist', () => {
    const result = makeResult({ totalCurrentSpend: 150, hasSignificantSavings: true })
    const summary = buildFallbackSummary(result)
    expect(summary).toContain('150')
  })

  it('produces optimized message when no significant savings', () => {
    const result = makeResult({
      hasSignificantSavings: false,
      totalMonthlySavings: 0,
    })
    const summary = buildFallbackSummary(result)
    expect(summary.toLowerCase()).toContain('optimized')
  })

  it('includes monthly savings amount when savings are significant', () => {
    const result = makeResult({
      hasSignificantSavings: true,
      totalMonthlySavings: 45,
    })
    const summary = buildFallbackSummary(result)
    expect(summary).toContain('45')
  })

  it('includes annual savings amount when savings are significant', () => {
    const result = makeResult({
      hasSignificantSavings: true,
      totalAnnualSavings: 540,
    })
    const summary = buildFallbackSummary(result)
    expect(summary).toContain('540')
  })

  it('handles zero spend gracefully', () => {
    const result = makeResult({
      totalCurrentSpend: 0,
      totalMonthlySavings: 0,
      hasSignificantSavings: false,
    })
    const summary = buildFallbackSummary(result)
    expect(typeof summary).toBe('string')
    expect(summary.length).toBeGreaterThan(0)
  })

  it('returns fallback for empty AI response scenario', () => {
    const result = makeResult({
      hasSignificantSavings: true,
      totalMonthlySavings: 20,
      totalAnnualSavings: 240,
      totalCurrentSpend: 80,
    })
    const summary = buildFallbackSummary(result)
    expect(summary).toContain('20')
    expect(summary).toContain('240')
    expect(summary).toContain('80')
  })
})
