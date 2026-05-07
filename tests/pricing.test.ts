import { describe, it, expect } from 'vitest'
import {
  getVendorById,
  getPlanByName,
  getEffectiveMonthlyCost,
  getCheaperPlans,
  getOverlappingVendors,
} from '@/lib/pricing'
import { VENDORS } from '@/lib/pricing/tools'

describe('getVendorById', () => {
  it('returns vendor for known id', () => {
    expect(getVendorById('chatgpt')?.name).toBe('ChatGPT')
  })

  it('returns undefined for unknown id', () => {
    expect(getVendorById('unknown-tool')).toBeUndefined()
  })
})

describe('getPlanByName', () => {
  it('returns correct plan by name (case insensitive)', () => {
    const plan = getPlanByName('chatgpt', 'plus')
    expect(plan?.planName).toBe('Plus')
    expect(plan?.monthlyPricePerSeat).toBe(20)
  })

  it('returns undefined for unknown plan', () => {
    expect(getPlanByName('chatgpt', 'nonexistent')).toBeUndefined()
  })
})

describe('getEffectiveMonthlyCost', () => {
  it('uses flatMonthlyPrice when set', () => {
    const plan = { flatMonthlyPrice: 99, monthlyPricePerSeat: 20 } as any
    expect(getEffectiveMonthlyCost(plan, 5)).toBe(99)
  })

  it('uses per-seat pricing when flatMonthlyPrice is null', () => {
    const plan = { flatMonthlyPrice: null, monthlyPricePerSeat: 20 } as any
    expect(getEffectiveMonthlyCost(plan, 3)).toBe(60)
  })
})

describe('getCheaperPlans', () => {
  it('returns plans cheaper than current plan', () => {
    const cheaper = getCheaperPlans('chatgpt', 'Team', 1)
    expect(cheaper.length).toBeGreaterThan(0)
    cheaper.forEach((plan) => {
      expect(plan.monthlyPricePerSeat).toBeLessThan(30)
    })
  })

  it('returns empty array when already on cheapest plan', () => {
    const cheaper = getCheaperPlans('chatgpt', 'Free', 1)
    expect(cheaper).toHaveLength(0)
  })
})

describe('getOverlappingVendors', () => {
  it('returns overlapping vendors for chatgpt', () => {
    const overlaps = getOverlappingVendors('chatgpt')
    const ids = overlaps.map((v) => v.id)
    expect(ids).toContain('claude')
    expect(ids).toContain('gemini')
  })

  it('returns empty array for unknown vendor', () => {
    expect(getOverlappingVendors('unknown')).toHaveLength(0)
  })
})

describe('Pricing data integrity', () => {
  it('all vendors have at least one plan', () => {
    VENDORS.forEach((vendor: any) => {
      expect(vendor.plans.length).toBeGreaterThan(0)
    })
  })

  it('all plans have sourceUrl and lastVerified', () => {
    VENDORS.forEach((vendor: any) => {
      vendor.plans.forEach((plan: any) => {
        expect(plan.sourceUrl).toBeTruthy()
        expect(plan.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })
    })
  })

  it('all plan costs are non-negative', () => {
    VENDORS.forEach((vendor: any) => {
      vendor.plans.forEach((plan: any) => {
        expect(plan.monthlyPricePerSeat).toBeGreaterThanOrEqual(0)
      })
    })
  })
})
