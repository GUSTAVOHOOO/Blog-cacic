import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido').toLowerCase(),
})

export type LoginInput = z.infer<typeof loginSchema>
