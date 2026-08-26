import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Contact — PodGavel',
  description: 'Get in touch with the PodGavel team.',
}

const CONTACT_EMAIL = 'colonel@podgavel.com'

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="font-display text-sm font-semibold tracking-wide text-primary uppercase">
          Contact
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
          Get in touch
        </h1>
        <p className="mx-auto mt-5 max-w-md text-pretty text-muted-foreground">
          Questions about PodGavel, a partnership idea, or press inquiry?
          Reach out and we&apos;ll get back to you.
        </p>

        <div className="mt-10 flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl border border-border bg-card p-7">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
            <Mail className="h-6 w-6" strokeWidth={2} />
          </span>
          <p className="font-display text-lg font-semibold text-foreground">
            Joey Kleeman
          </p>
          <p className="text-sm text-muted-foreground">Auction Colonel</p>

          <Button
            size="lg"
            nativeButton={false}
            className="mt-3 w-full"
            render={<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
