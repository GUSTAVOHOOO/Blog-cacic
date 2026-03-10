'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Container, Text } from '@chakra-ui/react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Com flowType: 'implicit', o Supabase lê o #access_token da URL
    // automaticamente ao inicializar. Só precisamos verificar a sessão.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard')
      } else {
        router.push('/login?error=auth_failed')
      }
    })
  }, [router])

  return (
    <Container maxW="sm" py={20} textAlign="center">
      <Text color="fg.muted">Autenticando...</Text>
    </Container>
  )
}
