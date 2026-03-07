import { Inter, Inter_Tight } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-inter-tight',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://axionlab.in'),
  title: {
    template: '%s | AXIONLAB',
    default: 'AXIONLAB | Engineering for the obsessed.',
  },
  description: 'Independent systems engineering lab designing commerce infrastructure and high-performance applications.',
  openGraph: {
    siteName: 'AXIONLAB',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body className="bg-background text-white selection:bg-accent selection:text-white overflow-x-hidden">
        {/* Hash URL backward compatibility — runs before React hydration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var hash = window.location.hash;
              if (hash.startsWith('#/') && hash.length > 2) {
                var path = hash.slice(1);
                window.location.replace(path + window.location.search);
              }
            })();
          `
        }} />
        <Nav />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  )
}
