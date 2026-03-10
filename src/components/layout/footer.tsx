'use client'
import {
  Box,
  Container,
  VStack,
  HStack,
  Link as ChakraLink,
  Text,
  IconButton,
  Divider,
} from '@chakra-ui/react'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import NextLink from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <Box as="footer" bg="text.primary" color="bg.canvas" mt={16} pt={12} pb={6}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Footer Content */}
          <HStack justify={{ base: 'center', md: 'space-between' }} flexWrap="wrap" spacing={8}>
            {/* Column 1: About */}
            <VStack align={{ base: 'center', md: 'start' }} spacing={2}>
              <Text fontWeight="bold" fontSize="lg">
                CACIC
              </Text>
              <Text fontSize="sm" color="bg.card" maxW="sm">
                Centro Acadêmico de Ciências da Computação — UTFPR Santa Helena
              </Text>
            </VStack>

            {/* Column 2: Links */}
            <VStack align={{ base: 'center', md: 'start' }} spacing={2}>
              <Text fontWeight="bold" fontSize="sm">
                Links
              </Text>
              <ChakraLink as={NextLink} href="/blog" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Blog
              </ChakraLink>
              <ChakraLink as={NextLink} href="/eventos" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Eventos
              </ChakraLink>
              <ChakraLink as={NextLink} href="/contato" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Contato
              </ChakraLink>
            </VStack>

            {/* Column 3: Social Icons */}
            <VStack align={{ base: 'center', md: 'start' }} spacing={3}>
              <Text fontWeight="bold" fontSize="sm">
                Siga-nos
              </Text>
              <HStack spacing={3}>
                <IconButton
                  as="a"
                  href="https://github.com/cacic-ufpr"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<FiGithub />}
                  variant="ghost"
                  size="lg"
                  aria-label="GitHub"
                  _hover={{ color: 'brand.500' }}
                />
                <IconButton
                  as="a"
                  href="https://linkedin.com/company/cacic-ufpr"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<FiLinkedin />}
                  variant="ghost"
                  size="lg"
                  aria-label="LinkedIn"
                  _hover={{ color: 'brand.500' }}
                />
                <IconButton
                  as="a"
                  href="mailto:cacic@ufpr.br"
                  icon={<FiMail />}
                  variant="ghost"
                  size="lg"
                  aria-label="E-mail"
                  _hover={{ color: 'brand.500' }}
                />
              </HStack>
            </VStack>
          </HStack>

          <Divider borderColor="border.default" />

          {/* Copyright */}
          <VStack spacing={2} textAlign="center">
            <Text fontSize="xs" color="bg.card">
              © {currentYear} Centro Acadêmico de Ciências da Computação
            </Text>
            <Text fontSize="xs" color="bg.card">
              UTFPR — Campus Santa Helena
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}
