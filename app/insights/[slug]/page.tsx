import type { Metadata } from 'next'
import { getAllPosts, getPostBySlug, getAdjacentPosts } from '@/lib/blog'
import { PostNavigation } from '@/components/blog/PostNavigation'

export const dynamicParams = false

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  return {
    title: `${post.title} | AXIONLAB Insights`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  const allPosts = getAllPosts()
  const { default: Post } = await import(`@/content/blog/${slug}.mdx`)

  // BLE-03: only show navigation when 3+ posts exist
  const adjacent = allPosts.length >= 3 ? getAdjacentPosts(slug, allPosts) : { prev: null, next: null }

  return (
    <article className="max-w-3xl mx-auto px-6 pt-40 pb-40">
      {/* Post header */}
      <header className="mb-16 border-t border-white/10 pt-8">
        <p className="text-[10px] text-accent font-black uppercase tracking-[0.6em] mb-6">
          {post.date} — {post.readingTime}
        </p>
        <h1 className="font-condensed text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
          {post.title}
        </h1>
        <div className="flex gap-3 flex-wrap">
          {post.tags.map(tag => (
            <span key={tag} className="text-[9px] font-black uppercase tracking-[0.4em] text-muted border border-white/10 px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      </header>
      {/* MDX prose content */}
      <div className="prose prose-invert max-w-none">
        <Post />
      </div>
      <PostNavigation prev={adjacent.prev} next={adjacent.next} />
    </article>
  )
}
