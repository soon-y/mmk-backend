import { createClient } from '@supabase/supabase-js'

export const getSupabaseClient = () => {
  const supabaseUrl = process.env.PROJECT_URL
  const supabaseKey = process.env.SERVICE_ROLE

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in environment variables.')
  }

  return createClient(supabaseUrl, supabaseKey)
}
