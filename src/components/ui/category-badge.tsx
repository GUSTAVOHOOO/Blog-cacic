'use client'

import { Badge, BadgeProps } from '@chakra-ui/react'

type CategoryType = 'tecnologia' | 'educacao' | 'eventos' | 'comunidade' | 'outros'

interface CategoryBadgeProps extends BadgeProps {
  category: CategoryType
}

const categoryColors: Record<CategoryType, { bg: string; color: string }> = {
  tecnologia: { bg: 'blue.100', color: 'blue.800' },
  educacao: { bg: 'purple.100', color: 'purple.800' },
  eventos: { bg: 'pink.100', color: 'pink.800' },
  comunidade: { bg: 'green.100', color: 'green.800' },
  outros: { bg: 'gray.100', color: 'gray.800' },
}

export function CategoryBadge({ category, ...props }: CategoryBadgeProps) {
  const colors = categoryColors[category]

  return (
    <Badge
      {...props}
      bg={colors.bg}
      color={colors.color}
      fontSize="xs"
      fontWeight="bold"
      textTransform="capitalize"
    >
      {category}
    </Badge>
  )
}
