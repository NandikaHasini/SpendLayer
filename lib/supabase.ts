import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// For use in client components only
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey)

// For use in server actions and RSC only — never import in client components
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)
