'use client'

import { useState, type FormEvent } from 'react'
import { MessageSquare, Send, CheckCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function FeedbackSection() {
  const [name, setName] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('feedback').insert([
      {
        name: anonymous ? null : name.trim() || null,
        message: message.trim(),
        rating: rating > 0 ? rating : null,
      },
    ])

    if (error) {
      setError('Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
      setName('')
      setMessage('')
      setRating(0)
      setAnonymous(false)
    }
    setLoading(false)
  }

  return (
    <section id="feedback" className="mx-auto max-w-2xl px-5 py-16 md:py-24">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          <MessageSquare className="size-3.5" aria-hidden="true" />
          We value your input
        </span>
        <h2 className="mt-5 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Share your feedback
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Help us improve StudySync. Add your name or send it anonymously.
        </p>
      </div>

      {submitted ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle className="size-6" aria-hidden="true" />
          </span>
          <p className="font-display text-xl font-semibold text-foreground">
            Thank you!
          </p>
          <p className="text-sm text-muted-foreground">
            Your feedback has been received and added to the wall below.
          </p>
          <Button
            variant="outline"
            className="mt-2 rounded-full"
            onClick={() => setSubmitted(false)}
          >
            Send another
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="feedback-name"
                className="block text-sm font-medium text-foreground"
              >
                Name
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="size-4 rounded border-border accent-primary"
                />
                Send anonymously
              </label>
            </div>
            <input
              id="feedback-name"
              type="text"
              value={name}
              disabled={anonymous}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              placeholder={anonymous ? 'Anonymous' : 'Your name (optional)'}
            />
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              Rating
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value === rating ? 0 : value)}
                    aria-label={`${value} star${value > 1 ? 's' : ''}`}
                    className="p-0.5"
                  >
                    <Star
                      className={cn(
                        'size-6 transition-colors',
                        value <= rating
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground/40 hover:text-primary',
                      )}
                      aria-hidden="true"
                    />
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="feedback-message"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Message
            </label>
            <textarea
              id="feedback-message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Tell us what you think..."
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full rounded-full font-semibold sm:w-auto"
          >
            {loading ? 'Sending...' : 'Send Feedback'}
            <Send className="size-4" aria-hidden="true" />
          </Button>
        </form>
      )}
    </section>
  )
}
