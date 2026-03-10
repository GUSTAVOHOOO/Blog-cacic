import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error_description || error)}`
    )
  }

  // Cria a resposta de redirect ANTES do cliente Supabase,
  // para que os cookies de sessão sejam setados diretamente nela.
  const redirectTo = NextResponse.redirect(`${origin}/dashboard`)
  const redirectError = (msg: string) =>
    NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(msg)}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            redirectTo.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({ token_hash, type })
    if (verifyError) return redirectError(verifyError.message)
    return redirectTo
  }

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) return redirectError(exchangeError.message)
    return redirectTo
  }

  return redirectError('no_code')
}
