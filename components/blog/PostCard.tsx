import Link from 'next/link'
import type { PostMeta } from '@/lib/blog'

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/insights/${post.slug}`} className="group block border-t border-white/10 pt-8 pb-8">
      <p className="text-[10px] text-accent font-black uppercase tracking-[0.6em] mb-4">
        {post.date} — {post.readingTime}
      </p>
      <h3 className="font-condensed text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none mb-4 group-hover:text-accent transition-colors">
        {post.title}
      </h3>
      <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">
        {post.description}
      </p>
      <div className="flex gap-3 flex-wrap">
        {post.tags.map(tag => (
          <span key={tag} className="text-[9px] font-black uppercase tracking-[0.4em] text-muted border border-white/10 px-3 py-1">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
