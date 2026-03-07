import type { Metadata } from 'next'
import HomeClient from '@/components/HomeClient'

export const metadata: Metadata = {
  title: { absolute: 'AXIONLAB | Engineering for the obsessed.' },
  description: 'Independent systems engineering lab designing commerce infrastructure, AI agent systems, and high-performance applications.',
  openGraph: {
    title: 'AXIONLAB | Engineering for the obsessed.',
    description: 'Independent systems engineering lab designing commerce infrastructure, AI agent systems, and high-performance applications.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AXIONLAB | Engineering for the obsessed.',
    description: 'Independent systems engineering lab designing commerce infrastructure, AI agent systems, and high-performance applications.',
  },
  alternates: { canonical: '/' },
}

export default function Home() {
  return <HomeClient />
}
