import { describe, it, expect } from 'vitest'
import { runAudit } from '@/lib/audit/engine'
import type { AuditInput } from '@/types/audit'

const baseInput: AuditInput = {
  teamSize: 1,
  workflowType: 'solo_developer',
  usageIntensity: 'moderate',
  primaryUseCase: 'coding',
  overlappingSubscriptions: false,
  tools: [],
}

describe('Audit Engine — KEEP recommendations', () => {
  it('recommends KEEP for a solo user on an appropriately sized plan', () => {
    const input: AuditInput = {
      ...baseInput,
      tools: [
        { vendorId: 'chatgpt', planName: 'Plus', seats: 1, monthlySpend: 20 },
      ],
    }
    const result = runAudit(input)
    expect(result.recommendations[0].recommendationType).toBe('KEEP')
    expect(result.totalMonthlySavings).toBe(0)
  })

  it('recommends KEEP when stack is already fully optimized', () => {
    const input: AuditInput = {
      ...baseInput,
      tools: [
        { vendorId: 'github_copilot', planName: 'Pro', seats: 1, monthlySpend: 10 },
      ],
    }
    const result = runAudit(input)
    expect(result.recommendations[0].recommendationType).toBe('KEEP')
    expect(result.hasSignificantSavings).toBe(false)
  })
})

describe('Audit Engine — DOWNGRADE recommendations', () => {
  it('recommends DOWNGRADE for solo user on Team plan', () => {
    const input: AuditInput = {
      ...baseInput,
      teamSize: 1,
      tools: [
        { vendorId: 'chatgpt', planName: 'Team', seats: 1, monthlySpend: 30 },
      ],
    }
    const result = runAudit(input)
    expect(result.recommendations[0].recommendationType).toBe('DOWNGRADE')
    expect(result.totalMonthlySavings).toBeGreaterThan(0)
  })

  it('recommends DOWNGRADE for solo user on Business plan', () => {
    const input: AuditInput = {
      ...baseInput,
      teamSize: 1,
      tools: [
        { vendorId: 'cursor', planName: 'Business', seats: 1, monthlySpend: 40 },
      ],
    }
    const result = runAudit(input)
    expect(result.recommendations[0].recommendationType).toBe('DOWNGRADE')
    expect(result.recommendations[0].confidence).toBe('HIGH')
  })

  it('calculates annual savings correctly from downgrade', () => {
    const input: AuditInput = {
      ...baseInput,
      teamSize: 1,
      tools: [
        { vendorId: 'chatgpt', planName: 'Team', seats: 1, monthlySpend: 30 },
      ],
    }
    const result = runAudit(input)
    const rec = result.recommendations[0]
    expect(rec.annualSavings).toBe(rec.monthlySavings * 12)
  })
})

describe('Audit Engine — REMOVE_REDUNDANCY recommendations', () => {
  it('flags paid redundant tools when overlapping tools exist', () => {
    const input: AuditInput = {
      ...baseInput,
      overlappingSubscriptions: true,
      tools: [
        { vendorId: 'chatgpt', planName: 'Plus', seats: 1, monthlySpend: 20 },
        { vendorId: 'claude', planName: 'Pro', seats: 1, monthlySpend: 20 },
      ],
    }
    const result = runAudit(input)
    const redundancyRec = result.recommendations.find(
      (r) => r.recommendationType === 'REMOVE_REDUNDANCY'
    )
    expect(redundancyRec).toBeDefined()
  })

  it('does not flag free tools as redundant', () => {
    const input: AuditInput = {
      ...baseInput,
      tools: [
        { vendorId: 'chatgpt', planName: 'Free', seats: 1, monthlySpend: 0 },
        { vendorId: 'claude', planName: 'Free', seats: 1, monthlySpend: 0 },
      ],
    }
    const result = runAudit(input)
    const redundancyRecs = result.recommendations.filter(
      (r) => r.recommendationType === 'REMOVE_REDUNDANCY'
    )
    expect(redundancyRecs).toHaveLength(0)
  })
})

describe('Audit Engine — CONSOLIDATE recommendations', () => {
  it('recommends Cursor when both Copilot and ChatGPT are present', () => {
    const input: AuditInput = {
      ...baseInput,
      primaryUseCase: 'coding',
      tools: [
        { vendorId: 'github_copilot', planName: 'Pro', seats: 1, monthlySpend: 10 },
        { vendorId: 'chatgpt', planName: 'Plus', seats: 1, monthlySpend: 20 },
      ],
    }
    const result = runAudit(input)
    const consolidateRec = result.recommendations.find(
      (r) => r.recommendationType === 'CONSOLIDATE'
    )
    expect(consolidateRec).toBeDefined()
    expect(consolidateRec?.recommendedAlternativeVendorId).toBe('cursor')
  })
})

describe('Audit Engine — API_USAGE informational recommendation', () => {
  it('API_USAGE recommendation carries zero savings', () => {
    const input: AuditInput = {
      ...baseInput,
      usageIntensity: 'light',
      teamSize: 1,
      tools: [
        { vendorId: 'chatgpt', planName: 'Plus', seats: 1, monthlySpend: 20 },
      ],
    }
    const result = runAudit(input)
    const apiRec = result.recommendations.find(
      (r) => r.recommendationType === 'API_USAGE'
    )
    if (apiRec) {
      expect(apiRec.monthlySavings).toBe(0)
      expect(apiRec.annualSavings).toBe(0)
    }
  })
})

describe('Audit Engine — no-savings scenario', () => {
  it('returns hasSignificantSavings false when all tools are optimal', () => {
    const input: AuditInput = {
      ...baseInput,
      tools: [
        { vendorId: 'cursor', planName: 'Pro', seats: 1, monthlySpend: 20 },
      ],
    }
    const result = runAudit(input)
    expect(result.hasSignificantSavings).toBe(false)
    expect(result.totalMonthlySavings).toBe(0)
  })
})

describe('Audit Engine — totals', () => {
  it('computes totalCurrentSpend correctly across multiple tools', () => {
    const input: AuditInput = {
      ...baseInput,
      tools: [
        { vendorId: 'cursor', planName: 'Pro', seats: 1, monthlySpend: 20 },
        { vendorId: 'github_copilot', planName: 'Pro', seats: 1, monthlySpend: 10 },
      ],
    }
    const result = runAudit(input)
    expect(result.totalCurrentSpend).toBe(30)
  })

  it('totalOptimizedSpend never goes below 0', () => {
    const input: AuditInput = {
      ...baseInput,
      tools: [
        { vendorId: 'chatgpt', planName: 'Team', seats: 1, monthlySpend: 1 },
      ],
    }
    const result = runAudit(input)
    expect(result.totalOptimizedSpend).toBeGreaterThanOrEqual(0)
  })
})
