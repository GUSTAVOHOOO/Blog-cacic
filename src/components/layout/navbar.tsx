'use client'
import {
  Box,
  Container,
  Flex,
  HStack,
  Link as ChakraLink,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react'
import { ColorModeButton } from '@chakra-ui/color-mode'
import { HiMenu, HiX } from 'react-icons/hi'
import NextLink from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
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
            <Box display={{ base: 'none', sm: 'block' }}>CACIC</Box>
          </ChakraLink>

          {/* Desktop Navigation Links */}
          <HStack
            as="nav"
            spacing={6}
            display={{ base: 'none', md: 'flex' }}
          >
            <ChakraLink
              as={NextLink}
              href="/blog"
              _hover={{ color: 'brand.500' }}
            >
              Blog
            </ChakraLink>
            <ChakraLink
              as={NextLink}
              href="/eventos"
              _hover={{ color: 'brand.500' }}
            >
              Eventos
            </ChakraLink>
            <ChakraLink
              as={NextLink}
              href="/trabalhos"
              _hover={{ color: 'brand.500' }}
            >
              Trabalhos
            </ChakraLink>
            <ChakraLink
              as={NextLink}
              href="/membros"
              _hover={{ color: 'brand.500' }}
            >
              Membros
            </ChakraLink>
            <ChakraLink
              as={NextLink}
              href="/sobre"
              _hover={{ color: 'brand.500' }}
            >
              Sobre
            </ChakraLink>
          </HStack>

          {/* Right: Dark Mode Toggle + Login Button */}
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            <ColorModeButton />
            <Button
              as={NextLink}
              href="/login"
              bg="brand.500"
              color="black"
              _hover={{ bg: 'brand.600' }}
              size="sm"
              fontWeight="bold"
            >
              Login
            </Button>
          </HStack>

          {/* Mobile Menu Button */}
          {showMobileMenu && (
            <HStack spacing={2}>
              <ColorModeButton />
              <Menu isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <MenuButton
                  as={IconButton}
                  icon={isOpen ? <HiX /> : <HiMenu />}
                  variant="ghost"
                  size="lg"
                  aria-label="Menu"
                />
                <MenuList>
                  <MenuItem as={NextLink} href="/blog">
                    Blog
                  </MenuItem>
                  <MenuItem as={NextLink} href="/eventos">
                    Eventos
                  </MenuItem>
                  <MenuItem as={NextLink} href="/trabalhos">
                    Trabalhos
                  </MenuItem>
                  <MenuItem as={NextLink} href="/membros">
                    Membros
                  </MenuItem>
                  <MenuItem as={NextLink} href="/sobre">
                    Sobre
                  </MenuItem>
                  <MenuItem as={NextLink} href="/login">
                    Login
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          )}
        </Flex>
      </Container>
    </Box>
  )
}
