'use client'

import { useState } from 'react'
import type { PostMeta } from '@/lib/blog'
import { PostCard } from './PostCard'

export function TagFilter({ posts }: { posts: PostMeta[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).sort()
  const filtered = activeTag ? posts.filter(p => p.tags.includes(activeTag)) : posts

  return (
    <div>
      {/* Tag filter buttons */}
      <div className="flex gap-3 flex-wrap mb-16">
        <button
          onClick={() => setActiveTag(null)}
          className={`text-[9px] font-black uppercase tracking-[0.4em] px-3 py-1 border transition-colors ${
            !activeTag ? 'border-accent text-accent' : 'border-white/10 text-muted hover:text-white'
          }`}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`text-[9px] font-black uppercase tracking-[0.4em] px-3 py-1 border transition-colors ${
              activeTag === tag ? 'border-accent text-accent' : 'border-white/10 text-muted hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      {/* Post grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        {filtered.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-muted font-mono text-sm uppercase tracking-widest pt-8">
          No posts found.
        </p>
      )}
    </div>
  )
}
