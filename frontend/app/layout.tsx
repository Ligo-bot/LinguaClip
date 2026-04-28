import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinguaClip - Learn English with YouTube Videos',
  description: 'Transform YouTube videos into interactive language lessons with bilingual subtitles, word lookup, and sentence looping.',
  keywords: ['English learning', 'YouTube', 'subtitles', 'language learning', 'bilingual'],
  openGraph: {
    title: 'LinguaClip - Learn English with YouTube',
    description: 'Transform YouTube videos into interactive language lessons',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-bg text-dark-text">
        {children}
      </body>
    </html>
  )
}
