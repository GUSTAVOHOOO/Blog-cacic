'use server'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/validations/auth'
import { redirect } from 'next/navigation'

export async function loginWithMagicLink(formData: FormData) {
  try {
    const rawEmail = formData.get('email') as string
    const parsed = loginSchema.parse({ email: rawEmail })
    const email = parsed.email

    // CRITICAL: Domain validation — @alunos.utfpr.edu.br only (AUTH-01)
    if (!email.endsWith('@alunos.utfpr.edu.br')) {
      throw new Error('Use seu e-mail institucional de aluno da UFPR (@alunos.utfpr.edu.br)')
    }

    // Create server client and request magic link
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        shouldCreateUser: true,
      },
    })

    if (error) {
      console.error('[loginWithMagicLink] Supabase error:', error.message)
      throw new Error('Erro ao enviar link. Tente novamente.')
    }

    // Redirect to confirmation page (AUTH-06)
    redirect('/login/verifique-seu-email')
  } catch (error) {
    throw error
  }
}
