'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from '@/lib/theme/config'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" storageKey="theme-mode">
      <ChakraProvider value={system}>
        {children}
      </ChakraProvider>
    </ThemeProvider>
  )
}
