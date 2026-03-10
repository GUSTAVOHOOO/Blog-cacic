'use client'
import {
  CardRoot,
  CardBody,
  Image,
  VStack,
  Heading,
  Text,
  HStack,
  Box,
  Link as ChakraLink,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { CategoryBadge } from '@/components/ui/category-badge'

interface PostCardProps {
  slug: string
  title: string
  excerpt: string
  category: 'tecnologia' | 'educacao' | 'eventos' | 'comunidade' | 'outros'
  thumbnail?: string
  date: string
}

export function PostCard({
  slug,
  title,
  excerpt,
  category,
  thumbnail,
  date,
}: PostCardProps) {
  return (
    <ChakraLink
      as={NextLink}
      href={`/blog/${slug}`}
      _hover={{ textDecoration: 'none' }}
    >
      <CardRoot
        borderLeftWidth="4px"
        borderLeftColor="brand.500"
        bg="bg.card"
        transition="all 0.2s"
        _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
        h="100%"
      >
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={title}
            h="200px"
            objectFit="cover"
            borderRadius="md"
          />
        )}
        <CardBody>
          <VStack align="start" gap={3} h="100%">
            <HStack gap={2}>
              <CategoryBadge category={category} />
              <Text fontSize="xs" color="text.secondary">
                {date}
              </Text>
            </HStack>

            <Heading as="h3" size="md" color="text.primary">
              {title}
            </Heading>

            <Text
              color="text.secondary"
              fontSize="sm"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              flex={1}
            >
              {excerpt}
            </Text>
          </VStack>
        </CardBody>
      </CardRoot>
    </ChakraLink>
  )
}
