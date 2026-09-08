import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6">
        <Link href="/" className="flex items-center justify-self-start">
          <Image
            src="/podgavel-logo.png"
            alt="PodGavel"
            width={1168}
            height={746}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="col-start-2 hidden items-center gap-8 justify-self-center md:flex">
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="/#waitlist"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Early access
          </Link>
          <Link
            href="/demo/podcaster"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Demo
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        <Button
          size="lg"
          nativeButton={false}
          className="col-start-3 justify-self-end"
          render={<Link href="/#waitlist">Request early access</Link>}
        />
      </div>
    </header>
  )
}
