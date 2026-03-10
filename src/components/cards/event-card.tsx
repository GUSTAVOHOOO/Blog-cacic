'use client'
import {
  CardRoot,
  CardBody,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Icon,
  Link as ChakraLink,
  Box,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import {
  FiCalendar,
  FiMapPin,
  FiBookOpen,
  FiAward,
  FiUsers,
} from 'react-icons/fi'

type EventType = 'palestra' | 'workshop' | 'hackathon' | 'competicao' | 'reuniao'

interface EventCardProps {
  slug: string
  title: string
  tipo: EventType
  dataInicio: string
  local?: string
  thumbnail?: string
}

const eventIcons: Record<EventType, React.ComponentType> = {
  palestra: FiBookOpen,
  workshop: FiUsers,
  hackathon: FiAward,
  competicao: FiAward,
  reuniao: FiUsers,
}

const eventTypeLabels: Record<EventType, string> = {
  palestra: 'Palestra',
  workshop: 'Workshop',
  hackathon: 'Hackathon',
  competicao: 'Competição',
  reuniao: 'Reunião',
}

export function EventCard({
  slug,
  title,
  tipo,
  dataInicio,
  local,
  thumbnail,
}: EventCardProps) {
  const IconComponent = eventIcons[tipo]

  return (
    <ChakraLink
      as={NextLink}
      href={`/eventos/${slug}`}
      _hover={{ textDecoration: 'none' }}
    >
      <CardRoot
        bg="bg.card"
        transition="all 0.2s"
        _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
        h="100%"
      >
        {thumbnail && (
          <Box
            h="180px"
            backgroundImage={`url(${thumbnail})`}
            backgroundSize="cover"
            backgroundPosition="center"
            borderRadius="md"
          />
        )}
        <CardBody>
          <VStack align="start" gap={3}>
            <HStack gap={2}>
              <Icon as={IconComponent} boxSize={5} color="brand.500" />
              <Badge bg="brand.100" color="black" fontWeight="bold">
                {eventTypeLabels[tipo]}
              </Badge>
            </HStack>

            <Heading as="h3" size="md" color="text.primary">
              {title}
            </Heading>

            <VStack align="start" gap={2} fontSize="sm" color="text.secondary" w="full">
              <HStack gap={2}>
                <Icon as={FiCalendar} boxSize={4} />
                <Text>{dataInicio}</Text>
              </HStack>
              {local && (
                <HStack gap={2}>
                  <Icon as={FiMapPin} boxSize={4} />
                  <Text>{local}</Text>
                </HStack>
              )}
            </VStack>
          </VStack>
        </CardBody>
      </CardRoot>
    </ChakraLink>
  )
}
