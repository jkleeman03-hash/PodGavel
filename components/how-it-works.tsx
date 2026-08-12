'use client'

import { useRef } from 'react'
import { Mic, CheckCircle2, Wallet } from 'lucide-react'

const SAMPLE_CLIPS = [
  { label: 'The Founder Files - Clip 1', src: '/voice-demo/sample-1.m4a' },
  { label: 'The Founder Files - Clip 2', src: '/voice-demo/sample-2.m4a' },
  { label: 'The Founder Files - Clip 3', src: '/voice-demo/sample-3.m4a' },
]

const STEPS = [
  {
    icon: Mic,
    title: 'Clone your voice',
    description:
      'From your past episodes, with your consent. A few minutes of audio is all it takes to build your voice model.',
  },
  {
    icon: CheckCircle2,
    title: 'Approve every read',
    description:
      'Nothing airs without your OK. Preview the AI-generated ad read and approve, tweak, or reject it before it goes live.',
  },
  {
    icon: Wallet,
    title: 'Get paid',
    description:
      "Fill slots you'd otherwise miss. Turn empty inventory into revenue without booking another recording session.",
  },
]

export function HowItWorks() {
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({})

  function handlePlay(src: string) {
    for (const [otherSrc, el] of Object.entries(audioRefs.current)) {
      if (otherSrc !== src && el && !el.paused) {
        el.pause()
      }
    }
  }

  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="max-w-2xl">
        <p className="font-display text-sm font-semibold tracking-wide text-primary uppercase">
          How it works
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
          From empty slot to airtime in three steps
        </h2>
      </div>

      <ol className="mt-14 grid gap-6 sm:grid-cols-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon
          return (
            <li
              key={step.title}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <span className="font-display text-sm font-semibold text-muted-foreground tabular-nums">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          )
        })}
      </ol>

      <div className="mt-14 rounded-2xl border border-border bg-card p-7 sm:p-10">
        <h3 className="font-display text-xl font-semibold text-foreground">
          Upload your clips (the more audio, the better)
        </h3>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {SAMPLE_CLIPS.map((clip) => (
            <div
              key={clip.src}
              className="flex flex-col gap-2.5 rounded-xl border border-border bg-background p-4"
            >
              <span className="text-sm font-medium text-foreground">
                {clip.label}
              </span>
              <audio
                controls
                preload="none"
                className="w-full"
                src={clip.src}
                ref={(el) => {
                  audioRefs.current[clip.src] = el
                }}
                onPlay={() => handlePlay(clip.src)}
              />
            </div>
          ))}
        </div>

        <h4 className="mt-9 font-display text-sm font-semibold tracking-wide text-primary uppercase">
          Professionally Cloned Ad Read
        </h4>
        <div className="mt-4 rounded-xl border border-primary/30 bg-accent p-4">
          <audio
            controls
            preload="none"
            className="w-full"
            src="/voice-demo/ad-read.mp3"
            ref={(el) => {
              audioRefs.current['/voice-demo/ad-read.mp3'] = el
            }}
            onPlay={() => handlePlay('/voice-demo/ad-read.mp3')}
          />
        </div>
      </div>
    </section>
  )
}
