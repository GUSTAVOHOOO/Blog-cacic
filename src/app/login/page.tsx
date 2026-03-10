'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import {
  Container,
  Heading,
  Text,
  Input,
  Button,
  Box,
} from '@chakra-ui/react'
import { loginWithPassword } from './actions'

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

        <Box display="flex" flexDirection="column" gap={1} textAlign="center">
          <Heading as="h1" size="lg">
            Entrar
          </Heading>
          <Text color="fg.muted" fontSize="sm">
            Área restrita — somente administradores
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={4}>

            <Box display="flex" flexDirection="column" gap={1}>
              <label htmlFor="email" className={styles.fieldLabel}>
                E-mail
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

            <Box display="flex" flexDirection="column" gap={1}>
              <label htmlFor="password" className={styles.fieldLabel}>
                Senha
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
              loading={isPending}
              loadingText="Entrando..."
              mt={2}
            >
              Entrar
            </Button>

          </Box>
        </form>

      </Box>
    </Container>
  )
}
