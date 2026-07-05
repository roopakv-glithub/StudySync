'use client'

import { useState, type FormEvent } from 'react'
import { MessageSquare, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export function FeedbackSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('feedback').insert([
      { name, email, message },
    ])

    if (!error) {
      setSubmitted(true)
      setName('')
      setEmail('')
      setMessage('')
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
          Help us improve StudySync. Let us know what you think.
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
            Your feedback has been received. We appreciate your input.
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
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="feedback-name" className="mb-1.5 block text-sm font-medium text-foreground">
                Name
              </label>
              <input
                id="feedback-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="feedback-email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="feedback-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="feedback-message" className="mb-1.5 block text-sm font-medium text-foreground">
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
