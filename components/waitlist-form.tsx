'use client'

import { useState } from 'react'
import { CheckCircle2, ChevronDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Role = '' | 'podcaster' | 'advertiser'

export function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !role) return
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showOrCompanyName: name,
          email,
          role,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <section
      id="waitlist"
      className="border-t border-border/60 bg-secondary/40"
    >
      <div className="mx-auto max-w-md px-6 py-20 sm:py-28">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Request early access
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-pretty text-muted-foreground">
            Join the waitlist and be among the first podcasters and advertisers
            on PodGavel.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {status === 'success' ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <p className="mt-5 font-display text-xl font-semibold text-foreground">
                You&apos;re on the list
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Thanks for signing up. We&apos;ll be in touch at{' '}
                <span className="font-medium text-foreground">{email}</span> as
                soon as early access opens.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Show or company name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="The Daily Byte"
                  className="h-11 rounded-lg border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 rounded-lg border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="role"
                  className="text-sm font-medium text-foreground"
                >
                  I&apos;m a
                </label>
                <div className="relative">
                  <select
                    id="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="h-11 w-full appearance-none rounded-lg border border-input bg-background px-3.5 pr-10 text-sm text-foreground outline-none transition-shadow focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 [&:invalid]:text-muted-foreground/70"
                  >
                    <option value="" disabled>
                      Select your role
                    </option>
                    <option value="podcaster">Podcaster</option>
                    <option value="advertiser">Advertiser</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {status === 'error' && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={status === 'submitting'}
                className="mt-1 h-11 w-full text-base"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Requesting…
                  </>
                ) : (
                  'Request early access'
                )}
              </Button>

              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                Voice cloning only ever happens with your explicit consent.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
