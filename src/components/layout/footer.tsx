'use client'
import {
  Box,
  Container,
  VStack,
  HStack,
  Link as ChakraLink,
  Text,
  Icon,
} from '@chakra-ui/react'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import NextLink from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <Box as="footer" bg="text.primary" color="bg.canvas" mt={16} pt={12} pb={6}>
      <Container maxW="container.xl">
        <VStack gap={8} align="stretch">
          {/* Footer Content */}
          <HStack justify={{ base: 'center', md: 'space-between' }} flexWrap="wrap" gap={8}>
            {/* Column 1: About */}
            <VStack align={{ base: 'center', md: 'start' }} gap={3}>
              <Text fontWeight="bold" fontSize="sm">
                Sobre
              </Text>
              <ChakraLink as={NextLink} href="/sobre" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Sobre CACIC
              </ChakraLink>
              <ChakraLink as={NextLink} href="/membros" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Membros
              </ChakraLink>
            </VStack>

            {/* Column 2: Links */}
            <VStack align={{ base: 'center', md: 'start' }} gap={3}>
              <Text fontWeight="bold" fontSize="sm">
                Conteúdo
              </Text>
              <ChakraLink as={NextLink} href="/blog" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Blog
              </ChakraLink>
              <ChakraLink as={NextLink} href="/trabalhos" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Trabalhos
              </ChakraLink>
              <ChakraLink as={NextLink} href="/eventos" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Eventos
              </ChakraLink>
              <ChakraLink as={NextLink} href="/contato" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Contato
              </ChakraLink>
            </VStack>

            {/* Column 3: Social Icons */}
            <VStack align={{ base: 'center', md: 'start' }} gap={3}>
              <Text fontWeight="bold" fontSize="sm">
                Siga-nos
              </Text>
              <HStack gap={3}>
                <ChakraLink
                  as="a"
                  href="https://github.com/cacic-ufpr"
                  target="_blank"
                  rel="noopener noreferrer"
                  _hover={{ color: 'brand.500' }}
                >
                  <Icon as={FiGithub} boxSize={6} />
                </ChakraLink>
                <ChakraLink
                  as="a"
                  href="https://linkedin.com/company/cacic-ufpr"
                  target="_blank"
                  rel="noopener noreferrer"
                  _hover={{ color: 'brand.500' }}
                >
                  <Icon as={FiLinkedin} boxSize={6} />
                </ChakraLink>
                <ChakraLink
                  as="a"
                  href="mailto:cacic@ufpr.br"
                  _hover={{ color: 'brand.500' }}
                >
                  <Icon as={FiMail} boxSize={6} />
                </ChakraLink>
              </HStack>
            </VStack>
          </HStack>

          {/* Copyright */}
          <Box borderTopWidth="1px" borderColor="border.default" pt={6} w="full" textAlign="center">
            <Text fontSize="xs" color="text.secondary">
              &copy; {currentYear} CACIC - Clube de Automação e Computação da UTFPR. Todos os direitos reservados.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
