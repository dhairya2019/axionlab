import type { MDXComponents } from 'mdx/types'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-condensed text-5xl font-black uppercase tracking-tighter leading-none mt-16 mb-8">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-condensed text-3xl font-black uppercase tracking-tighter leading-none mt-12 mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-condensed text-xl font-black uppercase tracking-tight mt-8 mb-4">
        {children}
      </h3>
    ),
    code: ({ children, ...props }) => {
      // rehype-pretty-code wraps highlighted code blocks in <code> inside <pre>
      // Only apply inline code styling when NOT inside a pre (no data-language attr)
      const isInline = !('data-language' in props)
      if (isInline) {
        return (
          <code className="bg-surface text-accent font-mono text-sm px-1.5 py-0.5">
            {children}
          </code>
        )
      }
      return <code {...props}>{children}</code>
    },
    pre: ({ children, ...props }) => (
      <pre className="bg-surface p-4 overflow-x-auto my-6 text-sm" {...props}>
        {children}
      </pre>
    ),
    a: ({ href, children }) => {
      const isInternal = href?.startsWith('/') || href?.startsWith('#')
      if (isInternal) {
        return (
          <Link href={href ?? '#'} className="text-accent underline underline-offset-2 hover:text-white transition-colors">
            {children}
          </Link>
        )
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-white transition-colors">
          {children}
        </a>
      )
    },
    img: (props) => (
      <Image
        sizes="(max-width: 768px) 100vw, 720px"
        className="w-full my-8"
        {...(props as ImageProps)}
        alt={props.alt ?? ''}
      />
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent pl-6 my-8 text-white/80 italic">
        {children}
      </blockquote>
    ),
    ...components,
  }
}
