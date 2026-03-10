'use client'
import {
  Box,
  Container,
  Flex,
  HStack,
  Link as ChakraLink,
  Button,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import { HiMenu, HiX, HiMoon, HiSun } from 'react-icons/hi'
import NextLink from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const showMobileMenu = useBreakpointValue({ base: true, md: false }, { fallback: 'md' })

  return (
    <Box
      as="nav"
      bg="bg.canvas"
      borderBottomWidth="1px"
      borderColor="border.default"
      position="sticky"
      top={0}
      zIndex={50}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" h="16">
          {/* Logo */}
          <ChakraLink
            as={NextLink}
            href="/"
            fontWeight="bold"
            fontSize="lg"
            display="flex"
            alignItems="center"
            gap={2}
            _hover={{ textDecoration: 'none', color: 'brand.500' }}
          >
            <Box as="span" fontSize="2xl" color="brand.500">
              CA
            </Box>
            <Box display={{ base: 'none', md: 'block' }}>CACIC</Box>
          </ChakraLink>

          {/* Desktop Navigation */}
          <HStack display={{ base: 'none', md: 'flex' }} gap={8}>
            <ChakraLink as={NextLink} href="/blog" _hover={{ color: 'brand.500' }}>
              Blog
            </ChakraLink>
            <ChakraLink as={NextLink} href="/eventos" _hover={{ color: 'brand.500' }}>
              Eventos
            </ChakraLink>
            <ChakraLink as={NextLink} href="/trabalhos" _hover={{ color: 'brand.500' }}>
              Trabalhos
            </ChakraLink>
            <ChakraLink as={NextLink} href="/membros" _hover={{ color: 'brand.500' }}>
              Membros
            </ChakraLink>
            <ChakraLink as={NextLink} href="/sobre" _hover={{ color: 'brand.500' }}>
              Sobre
            </ChakraLink>
            <ChakraLink as={NextLink} href="/contato" _hover={{ color: 'brand.500' }}>
              Contato
            </ChakraLink>
          </HStack>

          {/* Right side */}
          <HStack gap={4}>
            <Button
              variant="ghost"
              size="lg"
              p={0}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Icon as={theme === 'dark' ? HiSun : HiMoon} boxSize={6} />
            </Button>

            {/* Mobile Menu */}
            {showMobileMenu ? (
              <MenuRoot>
                <MenuTrigger asChild>
                  <Button variant="ghost" size="lg" p={0}>
                    <Icon as={isOpen ? HiX : HiMenu} boxSize={6} />
                  </Button>
                </MenuTrigger>
                <MenuContent>
                  <MenuItem value="blog">
                    <ChakraLink as={NextLink} href="/blog">
                      Blog
                    </ChakraLink>
                  </MenuItem>
                  <MenuItem value="eventos">
                    <ChakraLink as={NextLink} href="/eventos">
                      Eventos
                    </ChakraLink>
                  </MenuItem>
                  <MenuItem value="trabalhos">
                    <ChakraLink as={NextLink} href="/trabalhos">
                      Trabalhos
                    </ChakraLink>
                  </MenuItem>
                  <MenuItem value="membros">
                    <ChakraLink as={NextLink} href="/membros">
                      Membros
                    </ChakraLink>
                  </MenuItem>
                  <MenuItem value="sobre">
                    <ChakraLink as={NextLink} href="/sobre">
                      Sobre
                    </ChakraLink>
                  </MenuItem>
                  <MenuItem value="contato">
                    <ChakraLink as={NextLink} href="/contato">
                      Contato
                    </ChakraLink>
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
            ) : null}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
