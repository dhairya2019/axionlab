import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  author: string
  readingTime: string
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))

  return files
    .map(filename => {
      const slug = filename.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
      const { data, content } = matter(raw)
      const { text: readingTimeText } = readingTime(content)

      return {
        slug,
        title: data.title ?? 'Untitled',
        date: data.date ?? '',
        description: data.description ?? '',
        tags: data.tags ?? [],
        author: data.author ?? 'AXIONLAB',
        readingTime: readingTimeText,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): PostMeta {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf-8')
  const { data, content } = matter(raw)
  const { text: readingTimeText } = readingTime(content)

  return {
    slug,
    title: data.title ?? 'Untitled',
    date: data.date ?? '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    author: data.author ?? 'AXIONLAB',
    readingTime: readingTimeText,
  }
}
