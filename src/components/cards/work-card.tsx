'use client'
import {
  CardRoot,
  CardBody,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  Icon,
  Link as ChakraLink,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { FiDownload, FiUser } from 'react-icons/fi'

interface WorkCardProps {
  slug: string
  title: string
  area: string
  authors: string[]
  ano: number
  pdfUrl?: string
}

export function WorkCard({
  slug,
  title,
  area,
  authors,
  ano,
  pdfUrl,
}: WorkCardProps) {
  return (
    <CardRoot
      bg="bg.card"
      transition="all 0.2s"
      _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
      h="100%"
    >
      <CardBody>
        <VStack align="start" gap={4} h="100%">
          <HStack gap={2}>
            <Badge bg="brand.100" color="black" fontWeight="bold">
              {area}
            </Badge>
            <Text fontSize="xs" color="text.secondary">
              {ano}
            </Text>
          </HStack>

          <VStack align="start" gap={2} flex={1}>
            <Heading as="h3" size="md" color="text.primary">
              {title}
            </Heading>

            <VStack align="start" gap={1} fontSize="sm" color="text.secondary" w="full">
              {authors.map((author) => (
                <HStack key={author} gap={2}>
                  <Icon as={FiUser} boxSize={3} />
                  <Text>{author}</Text>
                </HStack>
              ))}
            </VStack>
          </VStack>

          <HStack w="full" gap={2}>
            <ChakraLink
              as={NextLink}
              href={`/trabalhos/${slug}`}
              flex={1}
              _hover={{ textDecoration: 'none' }}
            >
              <Button
                w="full"
                variant="outline"
                size="sm"
                color="brand.500"
                borderColor="brand.500"
                _hover={{ bg: 'brand.50' }}
              >
                Detalhes
              </Button>
            </ChakraLink>
            {pdfUrl && (
              <ChakraLink
                as="a"
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                flex={1}
                _hover={{ textDecoration: 'none' }}
              >
                <Button
                  w="full"
                  bg="brand.500"
                  color="black"
                  size="sm"
                  _hover={{ bg: 'brand.600' }}
                >
                  <Icon as={FiDownload} mr={2} />
                  PDF
                </Button>
              </ChakraLink>
            )}
          </HStack>
        </VStack>
      </CardBody>
    </CardRoot>
  )
}
