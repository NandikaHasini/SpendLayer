import { readFileSync } from 'fs'
import { describe, expect, it } from 'vitest'
import { normalizeFormStep } from '@/lib/audit/form-step'
import {
  numberInputValue,
  parseOptionalIntegerInput,
  parseOptionalMoneyInput,
} from '@/lib/audit/numeric-input'
import {
  getRecommendationTarget,
  getRenderableReportResult,
  RECOMMENDATION_LABELS,
} from '@/lib/audit/report-view-model'
import { runAudit } from '@/lib/audit/engine'
import type { AuditInput } from '@/types/audit'

const auditInput: AuditInput = {
  teamSize: 1,
  workflowType: 'solo_developer',
  usageIntensity: 'moderate',
  primaryUseCase: 'coding',
  overlappingSubscriptions: false,
  tools: [
    { vendorId: 'chatgpt', planName: 'Team', seats: 1, monthlySpend: 30 },
  ],
}

describe('report rendering model', () => {
  it('returns persisted audit result when route id matches stored id', () => {
    const result = runAudit(auditInput, {
      generatedAt: '2026-01-01T00:00:00.000Z',
    })

    expect(getRenderableReportResult(result, 'abc123', 'abc123')).toBe(result)
  })

  it('returns null for missing or mismatched audit results', () => {
    const result = runAudit(auditInput)

    expect(getRenderableReportResult(null, null, 'abc123')).toBeNull()
    expect(getRenderableReportResult(result, 'other-id', 'abc123')).toBeNull()
  })

  it('exposes labels for every supported recommendation type', () => {
    expect(RECOMMENDATION_LABELS.KEEP).toBe('Keep')
    expect(RECOMMENDATION_LABELS.DOWNGRADE).toBe('Downgrade')
    expect(RECOMMENDATION_LABELS.CONSOLIDATE).toBe('Consolidate')
    expect(RECOMMENDATION_LABELS.REMOVE_REDUNDANCY).toBe('Remove redundancy')
    expect(RECOMMENDATION_LABELS.API_USAGE).toBe('API usage')
  })

  it('derives recommendation target from plan, alternative, or no-op state', () => {
    const result = runAudit(auditInput)
    expect(getRecommendationTarget(result.recommendations[0])).toBe('Plus')

    const keepResult = runAudit({
      ...auditInput,
      tools: [
        { vendorId: 'cursor', planName: 'Pro', seats: 1, monthlySpend: 20 },
      ],
    })
    expect(getRecommendationTarget(keepResult.recommendations[0])).toBe(
      'No plan change'
    )
  })

  it('removes placeholder report page text', () => {
    const pageSource = readFileSync('app/spend-report/[id]/page.tsx', 'utf8')

    expect(pageSource).not.toContain('Phase 6')
    expect(pageSource).not.toContain('test-id')
  })
})

describe('hydration-safe form step handling', () => {
  it('normalizes invalid persisted steps to step 1', () => {
    expect(normalizeFormStep(undefined)).toBe(1)
    expect(normalizeFormStep(null)).toBe(1)
    expect(normalizeFormStep(0)).toBe(1)
    expect(normalizeFormStep(5)).toBe(1)
  })

  it('preserves valid form steps', () => {
    expect(normalizeFormStep(1)).toBe(1)
    expect(normalizeFormStep(4)).toBe(4)
  })
})

describe('numeric input parsing', () => {
  it('allows temporarily empty numeric input', () => {
    expect(parseOptionalIntegerInput('')).toBeUndefined()
    expect(parseOptionalMoneyInput('')).toBeUndefined()
    expect(numberInputValue(undefined)).toBe('')
  })

  it('parses natural integer and money edits', () => {
    expect(parseOptionalIntegerInput('123')).toBe(123)
    expect(parseOptionalMoneyInput('123.45')).toBe(123.45)
    expect(numberInputValue(123)).toBe('123')
  })
})
