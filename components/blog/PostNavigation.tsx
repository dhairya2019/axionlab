import Link from 'next/link'
import type { PostMeta } from '@/lib/blog'

export function PostNavigation({
  prev,
  next,
}: {
  prev: PostMeta | null
  next: PostMeta | null
}) {
  if (!prev && !next) return null

  return (
    <nav className="border-t border-white/10 pt-12 mt-16 grid grid-cols-2 gap-8" aria-label="Post navigation">
      <div>
        {prev && (
          <Link href={`/insights/${prev.slug}`} className="group block">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted mb-2">
              Previous
            </p>
            <p className="text-sm font-black uppercase tracking-tight group-hover:text-accent transition-colors leading-tight">
              {prev.title}
            </p>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link href={`/insights/${next.slug}`} className="group block">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted mb-2">
              Next
            </p>
            <p className="text-sm font-black uppercase tracking-tight group-hover:text-accent transition-colors leading-tight">
              {next.title}
            </p>
          </Link>
        )}
      </div>
    </nav>
  )
}
