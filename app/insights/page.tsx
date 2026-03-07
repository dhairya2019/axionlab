import { getAllPosts } from '@/lib/blog'
import { TagFilter } from '@/components/blog/TagFilter'

export default function InsightsPage() {
  const posts = getAllPosts()

  return (
    <div className="pt-40 px-6 md:px-12 max-w-7xl mx-auto min-h-screen pb-40">
      <div className="border-t border-white/10 pt-24 max-w-4xl mb-16">
        <h1 className="text-[10px] text-accent font-black uppercase tracking-[0.6em] mb-12">
          Research & Briefings
        </h1>
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
          Insights.
        </h2>
      </div>
      <TagFilter posts={posts} />
    </div>
  )
}
