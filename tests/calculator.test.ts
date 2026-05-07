import { describe, it, expect } from 'vitest'
import {
  computeSavingsBreakdown,
  isSavingsSignificant,
  computeAnnualFromMonthly,
  computeTotalCurrentSpend,
  computeTotalOptimizedSpend,
  MINIMUM_SAVINGS_THRESHOLD,
} from '@/lib/audit/calculator'

describe('computeSavingsBreakdown', () => {
  it('computes correct monthly savings', () => {
    const result = computeSavingsBreakdown(100, 60)
    expect(result.monthlySavings).toBe(40)
  })

  it('computes correct annual savings', () => {
    const result = computeSavingsBreakdown(100, 60)
    expect(result.annualSavings).toBe(480)
  })

  it('computes correct savings percentage', () => {
    const result = computeSavingsBreakdown(100, 60)
    expect(result.savingsPercentage).toBe(40)
  })

  it('returns 0 savings when optimized equals current', () => {
    const result = computeSavingsBreakdown(50, 50)
    expect(result.monthlySavings).toBe(0)
    expect(result.savingsPercentage).toBe(0)
  })

  it('clamps negative savings to 0', () => {
    const result = computeSavingsBreakdown(50, 80)
    expect(result.monthlySavings).toBe(0)
  })

  it('handles zero current spend without dividing by zero', () => {
    const result = computeSavingsBreakdown(0, 0)
    expect(result.savingsPercentage).toBe(0)
  })
})

describe('isSavingsSignificant', () => {
  it('returns false below threshold', () => {
    expect(isSavingsSignificant(MINIMUM_SAVINGS_THRESHOLD - 1)).toBe(false)
  })

  it('returns true at threshold', () => {
    expect(isSavingsSignificant(MINIMUM_SAVINGS_THRESHOLD)).toBe(true)
  })

  it('returns true above threshold', () => {
    expect(isSavingsSignificant(50)).toBe(true)
  })
})

describe('computeAnnualFromMonthly', () => {
  it('multiplies by 12', () => {
    expect(computeAnnualFromMonthly(25)).toBe(300)
  })
})

describe('computeTotalCurrentSpend', () => {
  it('sums array correctly', () => {
    expect(computeTotalCurrentSpend([20, 10, 15])).toBe(45)
  })

  it('returns 0 for empty array', () => {
    expect(computeTotalCurrentSpend([])).toBe(0)
  })
})

describe('computeTotalOptimizedSpend', () => {
  it('subtracts total savings from total current', () => {
    expect(computeTotalOptimizedSpend([100, 50], [20, 10])).toBe(120)
  })

  it('never returns negative', () => {
    expect(computeTotalOptimizedSpend([10], [100])).toBeGreaterThanOrEqual(0)
  })
})
