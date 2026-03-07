import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-xl">
        <span className="font-mono text-accent text-[10px] tracking-[0.4em] uppercase font-black">
          404 — Node Not Found
        </span>
        <h1 className="text-8xl font-black uppercase tracking-tighter text-white mt-4 mb-8">
          Signal Lost.
        </h1>
        <p className="text-muted uppercase tracking-tight font-bold mb-12">
          The path you requested does not exist in this system.
        </p>
        <Link
          href="/"
          className="px-10 h-14 bg-accent text-white inline-flex items-center justify-center text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
        >
          Return to Base
        </Link>
      </div>
    </div>
  )
}
