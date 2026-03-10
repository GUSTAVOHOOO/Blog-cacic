import { Box, Container, Heading, Text, Button, Link as ChakraLink } from '@chakra-ui/react'
import { createClient } from '@/lib/supabase/server'
import NextLink from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <Container maxW="lg" py={10}>
      <Box mb={8}>
        <Heading as="h1" size="lg" mb={2}>
          Dashboard
        </Heading>
        <Text color="text.secondary">
          Bem-vindo, {user?.email}!
        </Text>
      </Box>

      <Text color="text.secondary" mb={6}>
        Este é um espaço protegido. Apenas usuários autenticados podem acessar.
      </Text>

      <ChakraLink asChild>
        <NextLink href="/">
          <Button bg="brand.500" color="black">
            Voltar ao Home
          </Button>
        </NextLink>
      </ChakraLink>
    </Container>
  )
}
