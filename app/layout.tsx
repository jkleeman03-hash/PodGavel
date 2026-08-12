import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://podgavel.com'),
  title: 'PodGavel — Fill open ad-slots, last-minute, in your own voice',
  description:
    'PodGavel connects podcasters with advertisers. Advertisers submit their bid & script, you approve before anything airs. No recording session required. Stop leaving advertising revenue on the table.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png' },
      { url: '/icon-512.png', sizes: '512x512' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'PodGavel — The Advertising Auction House for Podcasts',
    description:
      'PodGavel connects podcasters with advertisers. Advertisers submit their bid & script, you approve before anything airs. No recording session required.',
    url: 'https://podgavel.com',
    siteName: 'PodGavel',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PodGavel — The Advertising Auction House for Podcasts',
    description:
      'PodGavel connects podcasters with advertisers. Advertisers submit their bid & script, you approve before anything airs. No recording session required.',
    images: ['/twitter-image.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`light ${spaceGrotesk.variable} ${inter.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
