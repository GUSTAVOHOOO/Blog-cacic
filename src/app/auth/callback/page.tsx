'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Container, Text } from '@chakra-ui/react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const code = new URLSearchParams(window.location.search).get('code')

    if (code) {
      // PKCE flow: o verifier está no document.cookie (setado pelo browser client)
      // exchangeCodeForSession client-side consegue lê-lo corretamente
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
