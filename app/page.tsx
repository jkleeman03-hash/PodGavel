import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { WaitlistForm } from '@/components/waitlist-form'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <WaitlistForm />
      </main>
      <SiteFooter />
    </div>
  )
}
