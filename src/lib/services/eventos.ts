import 'server-only'
import { createClient } from '@/lib/supabase/server'

export interface Evento {
  id: string
  title: string
  slug: string
  description: string | null
  tipo: 'palestra' | 'workshop' | 'hackathon' | 'social' | 'outro'
  data_inicio: string
  data_fim: string | null
  local: string | null
  link_inscricao: string | null
  thumbnail_url: string | null
  publicado: boolean
  created_by: string | null
  created_at: string
}

/**
 * Returns published events, optionally filtered by tipo.
 * Ordered by data_inicio ascending (upcoming first). Defaults to limit 20.
 */
export async function getEventos(options?: {
  tipo?: string
  limit?: number
}): Promise<Evento[]> {
  const supabase = await createClient()

  let query = supabase
    .from('eventos')
    .select('*')
    .eq('publicado', true)
    .order('data_inicio', { ascending: true })
    .limit(options?.limit ?? 20)

  if (options?.tipo) {
    query = query.eq('tipo', options.tipo)
  }

  const { data, error } = await query

  if (error) {
    console.error('[getEventos]', error)
    return []
  }

  return (data as Evento[]) ?? []
}

/**
 * Returns a single published event by slug, or null if not found.
 */
export async function getEventoBySlug(slug: string): Promise<Evento | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('slug', slug)
    .eq('publicado', true)
    .single()

  if (error || !data) {
    return null
  }

  return data as Evento
}

/**
 * Creates a new event record.
 * SEC-09: Caller MUST verify editor or admin role before calling this function.
 */
export async function createEvento(
  data: Omit<Evento, 'id' | 'created_at'>
): Promise<Evento> {
  const supabase = await createClient()

  const { data: created, error } = await supabase
    .from('eventos')
    .insert(data)
    .select()
    .single()

  if (error || !created) {
    console.error('[createEvento]', error)
    throw new Error('Erro ao criar evento')
  }

  return created as Evento
}

/**
 * Updates an existing event by id.
 * SEC-09: Caller MUST verify editor or admin role before calling this function.
 */
export async function updateEvento(
  id: string,
  data: Partial<Evento>
): Promise<Evento> {
  const supabase = await createClient()

  const { data: updated, error } = await supabase
    .from('eventos')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error || !updated) {
    console.error('[updateEvento]', error)
    throw new Error('Erro ao atualizar evento')
  }

  return updated as Evento
}

/**
 * Deletes an event by id.
 * SEC-09: Caller MUST verify admin role before calling this function.
 */
export async function deleteEvento(id: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from('eventos').delete().eq('id', id)

  if (error) {
    console.error('[deleteEvento]', error)
    throw new Error('Erro ao excluir evento')
  }
}
