import type { ReactNode } from 'react'

interface CalloutProps {
  children: ReactNode
  label: string
  borderColor: string
  labelColor: string
}

function Callout({ children, label, borderColor, labelColor }: CalloutProps) {
  return (
    <div className={`not-prose border-l-2 ${borderColor} bg-surface px-5 py-4 my-6`}>
      <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${labelColor} mb-3`}>
        {label}
      </p>
      <div className="text-sm text-white/80 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export function Info({ children }: { children: ReactNode }) {
  return (
    <Callout label="Info" borderColor="border-white/30" labelColor="text-white/50">
      {children}
    </Callout>
  )
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <Callout label="Warning" borderColor="border-accent" labelColor="text-accent">
      {children}
    </Callout>
  )
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <Callout label="Tip" borderColor="border-white/15" labelColor="text-muted">
      {children}
    </Callout>
  )
}
