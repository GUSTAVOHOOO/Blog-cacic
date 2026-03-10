import 'server-only'
import { createClient } from '@/lib/supabase/server'

/**
 * Returns the total view count for a given post slug.
 * Queries the post_view_counts view.
 */
export async function getPostViewCount(slug: string): Promise<number> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('post_view_counts')
    .select('views')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return 0
  }

  return Number(data.views) ?? 0
}

/**
 * Formats a view count number for display.
 * Below 1000: returns as plain string ("42").
 * 1000+: returns "1.2k" format.
 */
export function formatViewCount(count: number): string {
  if (count < 1000) {
    return String(count)
  }
  return `${Math.round(count / 100) / 10}k`
}
