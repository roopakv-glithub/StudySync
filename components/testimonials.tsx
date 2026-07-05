'use client'

import useSWR from 'swr'
import { Quote, Star } from 'lucide-react'
import { getFeedback, type Feedback } from '@/lib/supabase'
import { cn } from '@/lib/utils'

function initials(name: string | null) {
  if (!name) return 'A'
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? 'A').toUpperCase() + (parts[1]?.[0] ?? '').toUpperCase()
}

const avatarColors = ['bg-primary', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5']

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'size-3.5',
            i < rating ? 'fill-primary text-primary' : 'text-muted-foreground/30',
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function Testimonials() {
  const { data, isLoading } = useSWR<Feedback[]>('feedback-wall', () => getFeedback(12), {
    revalidateOnFocus: false,
  })

  const items = data ?? []

  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold text-primary">
          What students are saying
        </span>
        <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Feedback from the community
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Real feedback submitted by StudySync users, straight from our database.
        </p>
      </div>

      {isLoading ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          No feedback yet — be the first to share your thoughts below.
        </p>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => (
            <figure
              key={f.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
            >
              <Quote className="size-6 text-primary/40" aria-hidden="true" />
              <blockquote className="flex-1 text-pretty text-sm leading-relaxed text-foreground">
                {f.message}
              </blockquote>
              <Stars rating={f.rating} />
              <figcaption className="flex items-center gap-3 border-t border-border pt-4">
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full text-xs font-bold text-primary-foreground',
                    avatarColors[i % avatarColors.length],
                  )}
                  aria-hidden="true"
                >
                  {initials(f.name)}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {f.name?.trim() ? f.name : 'Anonymous student'}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}
