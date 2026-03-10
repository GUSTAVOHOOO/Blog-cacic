import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  // Handle auth errors from Supabase
  if (error) {
    console.error('[auth/callback] error:', error, error_description)
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error_description || error)}`
    )
  }

  // No code provided
  if (!code) {
    console.error('[auth/callback] no code provided')
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  // Exchange code for session
  const supabase = await createClient()
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('[auth/callback] exchange error:', exchangeError.message)
    return NextResponse.redirect(
      `${origin}/login?error=exchange_failed&details=${encodeURIComponent(exchangeError.message)}`
    )
  }

  // Session established via cookies; redirect to dashboard
  return NextResponse.redirect(`${origin}/dashboard`)
}
