import { NextResponse } from 'next/server'
import { z } from 'zod'
import { saveAuditReportToSupabase } from '@/lib/report-storage'
import type { AuditInput } from '@/types/audit'

const reportWriteSchema = z.object({
  id: z.string().min(1),
  auditInput: z.object({
    tools: z.array(
      z.object({
        vendorId: z.string(),
        planName: z.string(),
        seats: z.number(),
        monthlySpend: z.number(),
      })
    ),
    teamSize: z.number(),
    workflowType: z.string(),
    usageIntensity: z.string(),
    primaryUseCase: z.string(),
    overlappingSubscriptions: z.boolean(),
  }),
  auditResult: z
    .object({
      recommendations: z.array(z.any()),
      savings: z.object({
        currentMonthlySpend: z.number(),
        optimizedMonthlySpend: z.number(),
        monthlySavings: z.number(),
        annualSavings: z.number(),
        savingsPercentage: z.number(),
      }),
      totalCurrentSpend: z.number(),
      totalOptimizedSpend: z.number(),
      totalMonthlySavings: z.number(),
      totalAnnualSavings: z.number(),
      hasSignificantSavings: z.boolean(),
      summary: z.string().nullable(),
      generatedAt: z.string(),
    })
    .passthrough(),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = reportWriteSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Invalid report payload.' },
      { status: 400 }
    )
  }

  const result = await saveAuditReportToSupabase(
    parsed.data.id,
    parsed.data.auditInput as AuditInput,
    parsed.data.auditResult
  )

  if (!result.ok) {
    return NextResponse.json(
      { message: result.message ?? 'Report persistence failed.' },
      { status: 503 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
