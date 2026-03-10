'use client'
import React from 'react'
import { Box, Container, VStack, Heading, Text, Input, Button, FormControl, FormLabel, useToast } from '@chakra-ui/react'
import { useActionState } from 'react'
import { loginWithMagicLink } from './actions'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginWithMagicLink, null)
  const toast = useToast()

  // Show error toast if action fails
  React.useEffect(() => {
    if (state instanceof Error) {
      toast({
        title: 'Erro',
        description: state.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [state, toast])

  return (
    <Container maxW="sm" py={20}>
      <VStack spacing={8}>
        <VStack spacing={2}>
          <Heading as="h1" size="lg">
            Acesse sua conta
          </Heading>
          <Text color="text.secondary">
            Enviamos um link para seu e-mail
          </Text>
        </VStack>

        <form action={formAction} style={{ width: '100%' }}>
          <FormControl isRequired>
            <FormLabel htmlFor="email">E-mail Institucional</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu.email@ufpr.br"
              disabled={isPending}
              required
            />
            <Text fontSize="xs" color="text.secondary" mt={2}>
              Use apenas e-mails terminados em @ufpr.br
            </Text>
          </FormControl>

          <Button
            w="full"
            type="submit"
            bg="brand.500"
            color="black"
            mt={6}
            isLoading={isPending}
            loadingText="Enviando..."
          >
            Enviar Link
          </Button>
        </form>
      </VStack>
    </Container>
  )
}
