import { NextRequest, NextResponse } from 'next/server'
import { persistLead } from '@/lib/leads/persist-lead'
import { isLikelyBotLead } from '@/lib/leads/abuse-protection'
import { z } from 'zod'

const optionalNullableString = z
  .string()
  .max(200)
  .nullable()
  .optional()
  .transform((value) => value ?? '')

const leadSchema = z.object({
  email: z.string().email('Valid email required'),
  company: optionalNullableString,
  role: optionalNullableString,
  teamSize: z.number().int().min(1).max(100000).optional(),
  auditId: z.string().min(1),
  website: z.string().max(200).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = leadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid lead data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    if (isLikelyBotLead(parsed.data.website)) {
      return NextResponse.json({ success: true })
    }

    const result = await persistLead({
      email: parsed.data.email,
      company: parsed.data.company,
      role: parsed.data.role,
      teamSize: parsed.data.teamSize,
      auditId: parsed.data.auditId,
    })

    if (!result.success) {
      // Silently accept — never expose internal persistence errors to client
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true })
  } catch {
    // Graceful failure — lead capture must never crash the report
    return NextResponse.json({ success: true })
  }
}
