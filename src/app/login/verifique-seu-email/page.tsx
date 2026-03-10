import { Box, Container, VStack, Heading, Text, Icon, Link as ChakraLink } from '@chakra-ui/react'
import { MdCheckCircle } from 'react-icons/md'
import NextLink from 'next/link'

export default function VerifyEmailPage() {
  return (
    <Container maxW="sm" py={20}>
      <VStack spacing={6} textAlign="center">
        <Icon as={MdCheckCircle} boxSize={16} color="brand.500" />

        <VStack spacing={2}>
          <Heading as="h1" size="lg">
            Link enviado!
          </Heading>
          <Text color="text.secondary">
            Verifique seu e-mail e clique no link para acessar sua conta.
          </Text>
        </VStack>

        <Text fontSize="sm" color="text.secondary" mt={4}>
          O link expira em 1 hora. Não recebeu? Verifique a pasta de spam.
        </Text>

        <ChakraLink
          as={NextLink}
          href="/login"
          color="brand.500"
          _hover={{ textDecoration: 'underline' }}
          mt={4}
        >
          Voltar ao login
        </ChakraLink>
      </VStack>
    </Container>
  )
}
