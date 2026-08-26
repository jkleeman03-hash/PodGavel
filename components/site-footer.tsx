import Image from 'next/image'
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <Image
          src="/podgavel-logo.png"
          alt="PodGavel"
          width={1168}
          height={746}
          className="h-7 w-auto"
        />

        <nav className="flex items-center gap-6">
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

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} PodGavel. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
