import type { SavingsBreakdown } from '@/types/audit'

const MINIMUM_SAVINGS_THRESHOLD = 5

export function computeSavingsBreakdown(
  currentMonthlySpend: number,
  optimizedMonthlySpend: number
): SavingsBreakdown {
  const monthlySavings = Math.max(0, currentMonthlySpend - optimizedMonthlySpend)
  const annualSavings = monthlySavings * 12
  const savingsPercentage =
    currentMonthlySpend > 0
      ? Math.round((monthlySavings / currentMonthlySpend) * 1000) / 10
      : 0

  return {
    currentMonthlySpend,
    optimizedMonthlySpend,
    monthlySavings,
    annualSavings,
    savingsPercentage,
  }
}

export function isSavingsSignificant(monthlySavings: number): boolean {
  return monthlySavings >= MINIMUM_SAVINGS_THRESHOLD
}

export function computeAnnualFromMonthly(monthly: number): number {
  return monthly * 12
}

export function computeTotalCurrentSpend(spends: number[]): number {
  return spends.reduce((sum, s) => sum + s, 0)
}

export function computeTotalOptimizedSpend(
  currentSpends: number[],
  savings: number[]
): number {
  const totalCurrent = computeTotalCurrentSpend(currentSpends)
  const totalSavings = savings.reduce((sum, s) => sum + s, 0)
  return Math.max(0, totalCurrent - totalSavings)
}

export { MINIMUM_SAVINGS_THRESHOLD }
