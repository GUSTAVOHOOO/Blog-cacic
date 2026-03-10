import { Box, Container, Heading, Text, Link as ChakraLink } from '@chakra-ui/react'
import { MdCheckCircle } from 'react-icons/md'
import NextLink from 'next/link'

export default function VerifyEmailPage() {
  return (
    <Container maxW="sm" py={20}>
      <Box display="flex" flexDirection="column" gap={6} textAlign="center">
        <Box as="div" fontSize="64px" color="brand.500" textAlign="center">
          <MdCheckCircle />
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <Heading as="h1" size="lg">
            Link enviado!
          </Heading>
          <Text color="text.secondary">
            Verifique seu e-mail e clique no link para acessar sua conta.
          </Text>
        </Box>

        <Text fontSize="sm" color="text.secondary" mt={4}>
          O link expira em 1 hora. Não recebeu? Verifique a pasta de spam.
        </Text>

        <ChakraLink
          asChild
          color="brand.500"
          _hover={{ textDecoration: 'underline' }}
          mt={4}
        >
          <NextLink href="/login">Voltar ao login</NextLink>
        </ChakraLink>
      </Box>
    </Container>
  )
}
