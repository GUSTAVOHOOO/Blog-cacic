import 'server-only'
import { createClient } from '@/lib/supabase/server'

/**
 * Records a view for a given post slug.
 * Inserts into post_views table. Non-critical — errors are logged but not thrown.
 */
export async function recordView(slug: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('post_views')
    .insert({ slug, created_at: new Date().toISOString() })

  if (error) {
    console.error('[recordView] Failed to record view:', error)
    // View recording is non-critical — do not throw
  }
}

/**
 * Returns the total view count for a given post slug.
 * Queries the post_view_counts view. Returns 0 if not found.
 */
export async function getViewCount(slug: string): Promise<number> {
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
