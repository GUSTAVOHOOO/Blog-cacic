'use client'
import React, { useState } from 'react'
import { Container, Heading, Text, Input, Button, Box } from '@chakra-ui/react'
import { loginWithMagicLink } from './actions'
import styles from './page.module.css'

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    try {
      await loginWithMagicLink(formData)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Container maxW="sm" py={20}>
      <Box display="flex" flexDirection="column" gap={8}>
        <Box display="flex" flexDirection="column" gap={2} textAlign="center">
          <Heading as="h1" size="lg">
            Acesse sua conta
          </Heading>
          <Text color="text.secondary">
            Enviamos um link para seu e-mail
          </Text>
        </Box>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Box display="flex" flexDirection="column" gap={4} width="100%">
            <Box>
              <label htmlFor="email" className={styles.label}>
                <Text fontSize="sm" fontWeight="500">E-mail Institucional</Text>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu.email@alunos.utfpr.edu.br"
                disabled={isPending}
                required
              />
              <Text fontSize="xs" color="text.secondary" mt={2}>
                Use apenas e-mails terminados em @alunos.utfpr.edu.br
              </Text>
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
              {isPending ? 'Enviando...' : 'Enviar Link'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  )
}
