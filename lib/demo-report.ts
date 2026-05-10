import { runAudit } from '@/lib/audit/engine'
import type { AuditInput, AuditResult } from '@/types/audit'

export const DEMO_REPORT_ID = 'demo'

export const demoAuditInput: AuditInput = {
  workflowType: 'small_team',
  teamSize: 8,
  usageIntensity: 'moderate',
  primaryUseCase: 'coding',
  overlappingSubscriptions: true,
  tools: [
    { vendorId: 'chatgpt', planName: 'Team', seats: 8, monthlySpend: 160 },
    { vendorId: 'claude', planName: 'Team', seats: 8, monthlySpend: 200 },
    { vendorId: 'cursor', planName: 'Pro', seats: 8, monthlySpend: 160 },
    {
      vendorId: 'github_copilot',
      planName: 'Business',
      seats: 8,
      monthlySpend: 80,
    },
    { vendorId: 'gemini', planName: 'Business', seats: 8, monthlySpend: 40 },
  ],
}

export function buildDemoAuditResult(): AuditResult {
  return runAudit(demoAuditInput, {
    generatedAt: '2026-05-08T00:00:00.000Z',
  })
}
