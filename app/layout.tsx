import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://spendlayer.com'

export const metadata: Metadata = {
  metadataBase: new URL(
    APP_URL.endsWith('/') ? APP_URL : `${APP_URL}/`
  ),

  title: {
    default: 'SpendLayer — SaaS Spend Audit',
    template: '%s | SpendLayer',
  },

  description:
    "Audit your SaaS stack in minutes. SpendLayer's deterministic engine identifies redundant tools, unused seats, and optimization opportunities.",

  keywords: [
    'SaaS spend audit',
    'software cost reduction',
    'SaaS optimization',
    'vendor consolidation',
  ],

  openGraph: {
    type: 'website',
    url: APP_URL,
    siteName: 'SpendLayer',

    title: 'SpendLayer — SaaS Spend Audit',

    description:
      'Identify redundant tooling and optimization opportunities with deterministic spend analysis.',

    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'SpendLayer — SaaS Spend Audit',
      },
    ],

    locale: 'en_US',
  },

  twitter: {
    card: 'summary_large_image',

    title: 'SpendLayer — SaaS Spend Audit',

    description:
      'Identify redundant tooling and optimization opportunities with deterministic spend analysis.',

    images: [`${APP_URL}/og-image.png`],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },

  alternates: {
    canonical: APP_URL,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,

  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: '#0f172a',
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#0f172a',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  )
}