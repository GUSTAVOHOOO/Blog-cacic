'use client'
import {
  CardRoot,
  CardBody,
  VStack,
  HStack,
  Image,
  Heading,
  Text,
  Link as ChakraLink,
  Box,
  Icon,
} from '@chakra-ui/react'
import { FiGithub, FiLinkedin } from 'react-icons/fi'

interface MemberCardProps {
  nome: string
  cargo: string
  photoUrl: string
  githubUrl?: string
  linkedinUrl?: string
}

export function MemberCard({
  nome,
  cargo,
  photoUrl,
  githubUrl,
  linkedinUrl,
}: MemberCardProps) {
  return (
    <CardRoot
      bg="bg.card"
      borderWidth="1px"
      borderColor="border.default"
      overflow="hidden"
      transition="all 0.3s ease-out"
      _hover={{
        transform: 'scale(1.02) rotateZ(1deg)',
        boxShadow: 'lg',
      }}
    >
      <Box
        h="200px"
        backgroundImage={`url(${photoUrl})`}
        backgroundSize="cover"
        backgroundPosition="center"
      />
      <CardBody>
        <VStack align="start" gap={2}>
          <Heading as="h3" size="md" color="text.primary">
            {nome}
          </Heading>

          <Text fontSize="sm" color="text.secondary">
            {cargo}
          </Text>

          <HStack gap={2} mt={3} pt={3} borderTopWidth="1px" borderColor="border.default" w="full">
            {githubUrl && (
              <ChakraLink
                as="a"
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ color: 'brand.500' }}
              >
                <Icon as={FiGithub} boxSize={5} />
              </ChakraLink>
            )}
            {linkedinUrl && (
              <ChakraLink
                as="a"
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ color: 'brand.500' }}
              >
                <Icon as={FiLinkedin} boxSize={5} />
              </ChakraLink>
            )}
          </HStack>
        </VStack>
      </CardBody>
    </CardRoot>
  )
}
