'use client'

import { useState } from 'react'
import VideoInput from '@/components/VideoInput'
import Head from 'next/head'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Head>
        <title>LinguaClip - Learn English with YouTube Videos</title>
      </Head>
      
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-dark-border bg-dark-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-dark-text">LinguaClip</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-dark-textSecondary hover:text-orange-500 transition-colors">Features</a>
              <a href="#how-it-works" className="text-dark-textSecondary hover:text-orange-500 transition-colors">How it Works</a>
              <a href="https://github.com/Ligo-bot/LinguaClip" target="_blank" rel="noopener noreferrer" className="text-dark-textSecondary hover:text-orange-500 transition-colors">GitHub</a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1">
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-dark-text mb-6">
                Learn English with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                  YouTube Videos
                </span>
              </h1>
              <p className="text-xl text-dark-textSecondary mb-10 max-w-2xl mx-auto">
                Paste any YouTube link and transform it into an interactive language learning experience with bilingual subtitles, word lookup, and sentence looping.
              </p>
              
              {/* Video Input */}
              <VideoInput onLoading={setIsLoading} />
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 px-4 bg-dark-card/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-dark-text mb-12">
                Powerful Learning Tools
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  }
                  title="Bilingual Subtitles"
                  description="View English subtitles alongside Chinese translations for better comprehension."
                />
                <FeatureCard
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  }
                  title="Click to Define"
                  description="Click on any English word to see its definition and examples instantly."
                />
                <FeatureCard
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  }
                  title="Sentence Looping"
                  description="Loop any sentence repeatedly to master pronunciation and intonation."
                />
                <FeatureCard
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  }
                  title="Adjustable Speed"
                  description="Slow down or speed up videos to match your learning pace."
                />
                <FeatureCard
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  }
                  title="Auto Subtitles"
                  description="Videos without subtitles? We use Whisper AI to generate them automatically."
                />
                <FeatureCard
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  }
                  title="Mobile Friendly"
                  description="Learn on any device - desktop, tablet, or mobile phone."
                />
                <FeatureCard
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  }
                  title="Phrase Highlighting"
                  description="Automatically highlights phrasal verbs and idioms in subtitles with orange markers."
                />
              </div>
            </div>
          </section>

          {/* How it Works Section */}
          <section id="how-it-works" className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-dark-text mb-12">
                How It Works
              </h2>
              <div className="space-y-8">
                <Step number={1} title="Paste a YouTube URL">
                  Copy any YouTube video link and paste it into the input box.
                </Step>
                <Step number={2} title="We Parse the Video">
                  Our system extracts subtitles or generates them using AI.
                </Step>
                <Step number={3} title="Start Learning">
                  Navigate through sentences, click words for definitions, and loop tricky parts.
                </Step>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-br from-orange-500 to-orange-600">
            <div className="max-w-2xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
              <p className="text-lg text-white/90 mb-8">
                Transform your YouTube watching into productive language learning.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <VideoInput onLoading={setIsLoading} />
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-dark-border bg-dark-card py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-dark-textSecondary">
            <p>Built with ❤️ for language learners</p>
            <p className="mt-2 text-sm">
              <a href="https://github.com/Ligo-bot/LinguaClip" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
                View on GitHub
              </a>
              {' • '}
              <a href="#" className="hover:text-orange-500">Privacy Policy</a>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-dark-card rounded-xl p-6 border border-dark-border hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/10">
      <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-500 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-dark-text mb-2">{title}</h3>
      <p className="text-dark-textSecondary">{description}</p>
    </div>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
        {number}
      </div>
      <div className="flex-1 pt-2">
        <h3 className="font-semibold text-lg text-dark-text mb-1">{title}</h3>
        <p className="text-dark-textSecondary">{children}</p>
      </div>
    </div>
  )
}
