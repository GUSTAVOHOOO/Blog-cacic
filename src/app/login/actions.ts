'use server'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/validations/auth'

export async function loginWithMagicLink(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const rawEmail = formData.get('email') as string

  // Validate with Zod
  const parsed = loginSchema.safeParse({ email: rawEmail })
  if (!parsed.success) {
    return { success: false, error: 'E-mail inválido.' }
  }
  const email = parsed.data.email

  // CRITICAL: Domain validation — @alunos.utfpr.edu.br only (AUTH-01)
  if (!email.endsWith('@alunos.utfpr.edu.br')) {
    return { success: false, error: 'Use seu e-mail institucional de aluno da UFPR (@alunos.utfpr.edu.br)' }
  }

  // Create server client and request magic link
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const supabase = await createClient()
  console.log('[loginWithMagicLink] emailRedirectTo:', `${appUrl}/auth/callback`)
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
      shouldCreateUser: true,
    },
  })

  if (error) {
    console.error('[loginWithMagicLink] Supabase error:', error.message)
    return { success: false, error: 'Erro ao enviar link. Tente novamente.' }
  }

  return { success: true }
}
