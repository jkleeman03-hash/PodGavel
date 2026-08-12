import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center">
          <Image
            src="/podgavel-logo.png"
            alt="PodGavel"
            width={1168}
            height={746}
            priority
            className="h-10 w-auto"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </a>
          <a
            href="#waitlist"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Early access
          </a>
        </nav>

        <Button
          size="lg"
          nativeButton={false}
          render={<a href="#waitlist">Request early access</a>}
        />
      </div>
    </header>
  )
}
