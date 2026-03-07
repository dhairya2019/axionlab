import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import { visit } from 'unist-util-visit'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  transpilePackages: ['framer-motion'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

// Reconstruct raw code text from tokenized spans AFTER rehype-pretty-code runs.
// RPC replaces all node properties, so pre/post pattern doesn't work.
// Instead, walk the <code> children (highlighted <span>s) and extract text content.
function extractText(node) {
  if (node.type === 'text') return node.value ?? ''
  if (node.children) return node.children.map(extractText).join('')
  return ''
}

const addRawToCodeBlocks = () => (tree) => {
  visit(tree, 'element', (node) => {
    if (node?.type === 'element' && node?.tagName === 'pre') {
      const codeEl = node.children?.find(
        (c) => c.type === 'element' && c.tagName === 'code'
      )
      if (!codeEl) return
      node.properties['raw'] = extractText(codeEl)
    }
  })
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkFrontmatter],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, {
        theme: 'github-dark',
        keepBackground: false,
      }],
      addRawToCodeBlocks,
    ],
  },
})

export default withMDX(nextConfig)
