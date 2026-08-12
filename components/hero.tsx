import { Button } from '@/components/ui/button'
import { Waveform } from '@/components/waveform'

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border/60"
    >
      {/* soft radial glow behind the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-[500px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-accent),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-3.5 py-1.5 text-xs font-semibold tracking-wide text-accent-foreground uppercase">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Early access
        </span>

        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-6xl sm:leading-[1.05]">
          Fill open ad-slots, last-minute, in your own voice*
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
          Advertisers submit their bid & script, you approve before anything
          airs. No recording session required.
        </p>

        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-pretty font-bold text-foreground">
          Stop leaving advertising revenue on the table.
        </p>

        <p className="mx-auto mt-2 max-w-xl text-sm text-pretty text-muted-foreground">
          *Professionally cloned, fitted to your specifications
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            nativeButton={false}
            className="h-11 px-6 text-base"
            render={<a href="#waitlist">Request early access</a>}
          />
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            className="h-11 px-6 text-base"
            render={<a href="#how-it-works">See how it works</a>}
          />
        </div>

        <div className="mt-14 flex items-center justify-center">
          <Waveform className="h-16 w-full max-w-md justify-center" />
        </div>
      </div>
    </section>
  )
}
