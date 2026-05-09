import { createClient } from '@supabase/supabase-js'

export interface LeadInput {
  email: string
  company?: string | null
  role?: string | null
  teamSize?: number
  auditId: string
}

export interface LeadPersistResult {
  success: boolean
  error?: string
}

export async function persistLead(lead: LeadInput): Promise<LeadPersistResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      success: false,
      error: 'Supabase not configured',
    }
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase.from('lead_captures').insert({
      email: lead.email,
      company: lead.company?.trim() || null,
      role: lead.role?.trim() || null,
      team_size: lead.teamSize ?? null,
      audit_id: lead.auditId,
      created_at: new Date().toISOString(),
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
