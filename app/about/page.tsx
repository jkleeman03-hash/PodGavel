import type { Metadata } from 'next'
import { Eye, ShieldCheck, Sparkles } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'About — PodGavel',
  description:
    'PodGavel is the premier auction house for podcast advertising — built on transparency, integrity, and innovation.',
}

const PILLARS = [
  {
    icon: Eye,
    title: 'Transparency',
    description:
      'Podcast analytics are verified, sold ad-reads are published, and feedback is accounted for.',
  },
  {
    icon: ShieldCheck,
    title: 'Integrity',
    description:
      'Full approval control prior to publishing. Every read ends with an AI tag so listeners are never deceived.',
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description:
      'Challenging the status quo, pushing the limits to create a better environment for all parties.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
          <p className="font-display text-sm font-semibold tracking-wide text-primary uppercase">
            About PodGavel
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            The premier auction house for podcast advertising
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground">
            As a podcaster, your focus should be creating the best content
            for your community — not whether you&apos;re filling your
            ad-slots, or filling them at the right price.
          </p>
        </section>

        <section className="border-t border-border/60 bg-secondary/40">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
            <p className="font-display text-sm font-semibold tracking-wide text-primary uppercase">
              Mission statement
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-pretty font-display text-xl font-semibold text-balance text-foreground sm:text-2xl">
              PodGavel is built to fix the podcast advertising landscape by
              creating a premium, live auction house.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
              We enable podcasts to earn what they deserve and advertisers to
              get the best bang for their buck.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <ul className="grid gap-6 sm:grid-cols-3">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon
              return (
                <li
                  key={pillar.title}
                  className="flex flex-col rounded-2xl border border-border bg-card p-7"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <h2 className="mt-6 font-display text-xl font-semibold text-foreground">
                    {pillar.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </li>
              )
            })}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
