import { NextRequest, NextResponse } from 'next/server'
import { generateAuditSummary } from '@/lib/ai/generate-summary'
import type { AuditResult } from '@/types/audit'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const auditResult = body?.auditResult as AuditResult | undefined

    if (!auditResult || typeof auditResult !== 'object') {
      return NextResponse.json(
        { error: 'Invalid audit result provided' },
        { status: 400 }
      )
    }

    const result = await generateAuditSummary(auditResult)

    return NextResponse.json({
      summary: result.summary,
      source: result.source,
    })
  } catch {
    return NextResponse.json(
      { error: 'Summary generation failed' },
      { status: 500 }
    )
  }
}
