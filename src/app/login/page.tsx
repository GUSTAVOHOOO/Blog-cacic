'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Heading, Text, Input, Button, Box } from '@chakra-ui/react'
import { loginWithPassword } from './actions'
import styles from './page.module.css'

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const result = await loginWithPassword(formData)

    if (!result.success) {
      setError(result.error ?? 'Erro desconhecido')
      setIsPending(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <Container maxW="sm" py={20}>
      <Box display="flex" flexDirection="column" gap={8}>
        <Box display="flex" flexDirection="column" gap={2} textAlign="center">
          <Heading as="h1" size="lg">
            Acesse sua conta
          </Heading>
          <Text color="text.secondary">
            Área restrita para administradores
          </Text>
        </Box>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Box display="flex" flexDirection="column" gap={4} width="100%">
            <Box>
              <label htmlFor="email" className={styles.label}>
                <Text fontSize="sm" fontWeight="500">E-mail</Text>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                disabled={isPending}
                required
              />
            </Box>

            <Box>
              <label htmlFor="password" className={styles.label}>
                <Text fontSize="sm" fontWeight="500">Senha</Text>
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                disabled={isPending}
                required
              />
            </Box>

            {error && (
              <Text fontSize="sm" color="red.500">
                {error}
              </Text>
            )}

            <Button
              w="full"
              type="submit"
              bg="brand.500"
              color="black"
              disabled={isPending}
            >
              {isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  )
}
