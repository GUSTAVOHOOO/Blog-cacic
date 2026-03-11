'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Container, Text } from '@chakra-ui/react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const params = new URLSearchParams(window.location.search)
    const token_hash = params.get('token_hash')
    const type = params.get('type')
    const code = params.get('code')

    if (token_hash && type) {
      // Fluxo token_hash: não precisa de cookie, funciona de qualquer browser
      supabase.auth.verifyOtp({ token_hash, type: type as any })
        .then(({ error }) => {
          if (error) router.push('/login?error=' + encodeURIComponent(error.message))
          else router.push('/dashboard')
        })
    } else if (code) {
      // Fluxo PKCE legado (fallback)
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) router.push('/login?error=' + encodeURIComponent(error.message))
          else router.push('/dashboard')
        })
    } else {
      router.push('/login?error=no_code')
    }
  }, [router])

  return (
    <Container maxW="sm" py={20} textAlign="center">
      <Text color="fg.muted">Autenticando...</Text>
    </Container>
  )
}
