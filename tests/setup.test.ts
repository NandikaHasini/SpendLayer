import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatCurrencyExact,
  calculateAnnualSavings,
  clampToZero,
} from '@/lib/utils'

describe('formatCurrency', () => {
  it('formats whole dollar amounts', () => {
    expect(formatCurrency(1500)).toBe('$1,500')
  })
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0')
  })
  it('formats large amounts', () => {
    expect(formatCurrency(12000)).toBe('$12,000')
  })
})

describe('formatCurrencyExact', () => {
  it('formats with two decimal places', () => {
    expect(formatCurrencyExact(99.5)).toBe('$99.50')
  })
  it('formats whole numbers with .00', () => {
    expect(formatCurrencyExact(100)).toBe('$100.00')
  })
})

describe('calculateAnnualSavings', () => {
  it('multiplies monthly by 12', () => {
    expect(calculateAnnualSavings(100)).toBe(1200)
  })
  it('handles zero', () => {
    expect(calculateAnnualSavings(0)).toBe(0)
  })
})

describe('clampToZero', () => {
  it('returns 0 for negative values', () => {
    expect(clampToZero(-50)).toBe(0)
  })
  it('returns positive values unchanged', () => {
    expect(clampToZero(75)).toBe(75)
  })
  it('returns 0 for zero', () => {
    expect(clampToZero(0)).toBe(0)
  })
})
