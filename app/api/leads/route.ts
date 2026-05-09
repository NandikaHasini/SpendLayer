import { NextRequest, NextResponse } from 'next/server'
import { persistLead } from '@/lib/leads/persist-lead'
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

    const result = await persistLead(parsed.data)

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
