import type { Metadata } from 'next'
import InitiateClient from '@/components/InitiateClient'

export const metadata: Metadata = {
  title: 'Initiate',
  description: 'Start a project with AXIONLAB. Define your architecture requirements, scope, and timeline.',
  openGraph: {
    title: 'Initiate | AXIONLAB',
    description: 'Start a project with AXIONLAB. Define your architecture requirements, scope, and timeline.',
    url: '/initiate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Initiate | AXIONLAB',
    description: 'Start a project with AXIONLAB. Define your architecture requirements, scope, and timeline.',
  },
  alternates: { canonical: '/initiate' },
}

export default function Initiate() {
  return <InitiateClient />
}
