'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable (non-HTTPS dev, iframe restriction, permission denied)
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
      className="absolute top-3 right-3 p-1.5 text-muted hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
    >
      {copied
        ? <Check size={14} className="text-accent" />
        : <Copy size={14} />
      }
    </button>
  )
}
