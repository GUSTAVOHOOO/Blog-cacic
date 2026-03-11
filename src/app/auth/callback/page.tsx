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

    const redirect = (error?: string) => {
      if (error) {
        router.push('/login?error=' + encodeURIComponent(error))
      } else {
        router.refresh()
        router.push('/dashboard')
      }
    }

    if (token_hash && type) {
      supabase.auth.verifyOtp({ token_hash, type: type as any })
        .then(({ error }) => redirect(error?.message))
    } else if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error }) => redirect(error?.message))
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
