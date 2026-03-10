'use client'
import { Box, VStack, Text, Button, Container } from '@chakra-ui/react'
import NextLink from 'next/link'
import { SplitText } from '@/components/ui/split-text'

export function HeroSection() {
  return (
    <Box
      bg="#0A0A0A"
      color="white"
      py={{ base: 16, md: 24 }}
      w="full"
    >
      <Container maxW="container.lg">
        <VStack gap={{ base: 6, md: 8 }} align="center" textAlign="center">
          {/* Animated Title */}
          <SplitText
            text="Bem-vindo ao Blog do CACIC"
            className="hero-title"
            delay={0.05}
          />

          {/* Subtitle */}
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="gray.300"
            maxW="2xl"
          >
            Explore eventos, trabalhos acadêmicos, e conteúdo técnico produzido pela comunidade de Ciências da Computação da UTFPR-SH.
          </Text>

          {/* CTA Button */}
          <Button
            asChild
            bg="brand.500"
            color="black"
            size="lg"
            fontWeight="bold"
            _hover={{ bg: 'brand.600', transform: 'translateY(-2px)' }}
            _active={{ transform: 'translateY(0)' }}
            transition="all 0.2s"
            mt={{ base: 4, md: 6 }}
          >
            <NextLink href="/blog">
              Explore o Blog
            </NextLink>
          </Button>

          {/* Optional: Secondary CTA */}
          <Text fontSize="sm" color="gray.400">
            ou conheça os{' '}
            <Button
              asChild
              variant="ghost"
              color="brand.500"
              textDecoration="underline"
              fontWeight="bold"
              _hover={{ textDecoration: 'none', bg: 'transparent' }}
              h="auto"
              p="0"
              fontSize="sm"
            >
              <NextLink href="/eventos">
                próximos eventos
              </NextLink>
            </Button>
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}
