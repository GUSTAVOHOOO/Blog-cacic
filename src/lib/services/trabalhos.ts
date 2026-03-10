import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface Trabalho {
  id: string
  title: string
  slug: string
  authors: string[]
  area: string
  summary: string | null
  pdf_url: string | null
  thumbnail_url: string | null
  publicado: boolean
  ano: number
  created_by: string | null
  created_at: string
}

/**
 * Returns published academic papers, optionally filtered by area.
 * Ordered by created_at descending (newest first). Defaults to limit 20.
 */
export async function getTrabalhos(options?: {
  area?: string
  limit?: number
}): Promise<Trabalho[]> {
  const supabase = await createClient()

  let query = supabase
    .from('trabalhos_academicos')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false })
    .limit(options?.limit ?? 20)

  if (options?.area) {
    query = query.eq('area', options.area)
  }

  const { data, error } = await query

  if (error) {
    console.error('[getTrabalhos]', error)
    return []
  }

  return (data as Trabalho[]) ?? []
}

/**
 * Returns a single academic paper by slug, or null if not found.
 */
export async function getTrabalhoBySlug(slug: string): Promise<Trabalho | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('trabalhos_academicos')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  return data as Trabalho
}

/**
 * Creates a new academic paper record.
 * Uses admin client for PDF URL storage reference (storage uploads handled separately in Route Handler).
 * SEC-09: Caller MUST verify member+ role before calling this function.
 */
export async function createTrabalho(
  data: Omit<Trabalho, 'id' | 'created_at'>
): Promise<Trabalho> {
  // Use admin client — PDF URL storage reference requires privileged insert
  const supabase = createAdminClient()

  const { data: created, error } = await supabase
    .from('trabalhos_academicos')
    .insert(data)
    .select()
    .single()

  if (error || !created) {
    console.error('[createTrabalho]', error)
    throw new Error('Erro ao criar trabalho acadêmico')
  }

  return created as Trabalho
}
