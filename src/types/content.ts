export interface PostFrontmatter {
  title: string
  date: string // ISO date string e.g. "2026-03-10"
  author: string
  category: string
  tags: string[]
  summary: string
  thumbnail?: string // path relative to /public or Supabase URL
  published: boolean
  slug: string // explicit slug field — do not derive from filename
}

export interface NoticiaFrontmatter extends PostFrontmatter {}

export interface PostMeta extends PostFrontmatter {
  readingTime: number // estimated minutes
}

export interface NoticiaMeta extends NoticiaFrontmatter {
  readingTime: number // estimated minutes
}
