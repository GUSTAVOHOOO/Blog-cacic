import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  // Magic link sends: ?token_hash=xxx&type=magiclink (newer format)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  // PKCE flow sends: ?code=xxx (older/explicit PKCE format)
  const code = searchParams.get('code')

  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  // Handle explicit auth errors from Supabase
  if (error) {
    console.error('[auth/callback] error:', error, error_description)
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error_description || error)}`
    )
  }

  const supabase = await createClient()

  // Path 1: token_hash flow (sent in magic link email by default)
  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    })

    if (verifyError) {
      console.error('[auth/callback] verifyOtp error:', verifyError.message)
      return NextResponse.redirect(
        `${origin}/login?error=verify_failed&details=${encodeURIComponent(verifyError.message)}`
      )
    }

    return NextResponse.redirect(`${origin}/dashboard`)
  }

  // Path 2: PKCE code exchange flow
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('[auth/callback] exchange error:', exchangeError.message)
      return NextResponse.redirect(
        `${origin}/login?error=exchange_failed&details=${encodeURIComponent(exchangeError.message)}`
      )
    }

    return NextResponse.redirect(`${origin}/dashboard`)
  }

  // No valid params provided
  console.error('[auth/callback] no token_hash/type or code provided')
  return NextResponse.redirect(`${origin}/login?error=no_code`)
}
