import { createClient } from '@supabase/supabase-js'

export const supabaseAuthClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

export async function getSession() {
  const { data: { session }, error } = await supabaseAuthClient.auth.getSession()
  if (error) throw error
  return session
}

export async function signOut() {
  const { error } = await supabaseAuthClient.auth.signOut()
  if (error) throw error
} 