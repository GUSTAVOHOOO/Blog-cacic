import 'server-only'
import { createClient } from '@/lib/supabase/server'

export interface ContatoInput {
  nome: string
  email: string
  assunto: 'Dúvida' | 'Sugestão' | 'Parceria' | 'Outro'
  mensagem: string
}

/**
 * Inserts a new contact form submission into the contatos table.
 * SEC-08: Internal errors are never exposed to the client.
 */
export async function createContato(
  data: ContatoInput
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from('contatos').insert({
    nome: data.nome,
    email: data.email,
    assunto: data.assunto,
    mensagem: data.mensagem,
    ip_hash: '', // Rate limiting via Redis in Route Handler — DB hash not required
  })

  if (error) {
    console.error('[createContato]', error)
    return { success: false, error: 'Erro interno ao salvar mensagem' }
  }

  return { success: true }
}

/**
 * Returns all contact form submissions ordered by most recent first.
 * SEC-09: Runtime double-verification guard — enforces admin-only access
 * inside this function, independent of the calling Route Handler or Server Action.
 */
export async function getContatos(): Promise<ContatoInput[] | { success: false; error: string }> {
  const supabase = await createClient()

  // SEC-09: runtime admin verification — double-verification pattern
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Não autenticado' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile || profile.role !== 'admin') {
    return { success: false, error: 'Acesso negado — requer perfil admin' }
  }

  const { data, error } = await supabase
    .from('contatos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getContatos]', error)
    return { success: false, error: 'Erro ao buscar contatos' }
  }

  return data ?? []
}
