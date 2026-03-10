import 'server-only'
import { createClient } from '@/lib/supabase/server'

export interface Membro {
  id: string
  nome: string
  cargo: string
  foto_url: string | null
  linkedin_url: string | null
  github_url: string | null
  gestao: number
  ativo: boolean
  ordem: number
}

/**
 * Returns all directorate members, optionally filtered by gestao year.
 * Ordered by ordem then nome.
 */
export async function getMembros(gestao?: number): Promise<Membro[]> {
  const supabase = await createClient()

  let query = supabase
    .from('membros_diretoria')
    .select('*')
    .order('ordem', { ascending: true })
    .order('nome', { ascending: true })

  if (gestao !== undefined) {
    query = query.eq('gestao', gestao)
  }

  const { data, error } = await query

  if (error) {
    console.error('[getMembros]', error)
    return []
  }

  return (data as Membro[]) ?? []
}

/**
 * Returns active directorate members ordered by ordem then cargo.
 */
export async function getMembrosAtivos(): Promise<Membro[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('membros_diretoria')
    .select('*')
    .eq('ativo', true)
    .order('ordem', { ascending: true })
    .order('cargo', { ascending: true })

  if (error) {
    console.error('[getMembrosAtivos]', error)
    return []
  }

  return (data as Membro[]) ?? []
}
