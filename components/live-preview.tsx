'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PlayCircle, Home, Bot, FileText, MessageSquare, CalendarClock } from 'lucide-react'
import { cn } from '@/lib/utils'

const PREVIEW_URL = process.env.NEXT_PUBLIC_PREVIEW_URL

const screens = [
  { id: 'home', label: 'Home', icon: Home, src: '/screens/dashboard.jpeg', alt: 'StudySync home dashboard' },
  { id: 'jarvis', label: 'Jarvis AI', icon: Bot, src: '/screens/ai.jpeg', alt: 'Jarvis AI assistant chat' },
  { id: 'notes', label: 'Notes', icon: FileText, src: '/screens/material.jpeg', alt: 'Study materials and subject folders' },
  { id: 'chat', label: 'Chat', icon: MessageSquare, src: '/screens/chat.jpeg', alt: 'Group study room and direct messages' },
  { id: 'tasks', label: 'Tasks', icon: CalendarClock, src: '/screens/task.jpeg', alt: 'Task and deadline calendar' },
]

export function LivePreview() {
  const [active, setActive] = useState(screens[0].id)
  const current = screens.find((s) => s.id === active) ?? screens[0]

  return (
    <section id="preview" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          <PlayCircle className="size-3.5" aria-hidden="true" />
          Live preview
        </span>
        <h2 className="mt-5 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Take StudySync for a spin
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Explore the real app screens right here. Tap through Jarvis AI, your
          notes, group chat, and your deadline calendar.
        </p>
      </div>

      <div className="mt-12 flex flex-col items-center gap-8">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {screens.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              aria-pressed={active === id}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                active === id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {/* Device */}
        <div className="relative w-[280px] shrink-0 rounded-[2.75rem] border-[7px] border-foreground/90 bg-foreground/90 shadow-2xl shadow-foreground/10">
          <div className="absolute left-1/2 top-2.5 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-background/40" />
          <div className="aspect-[9/19] overflow-hidden rounded-[2.25rem] bg-background">
            {PREVIEW_URL ? (
              <iframe
                src={PREVIEW_URL}
                title="StudySync interactive preview"
                className="h-full w-full border-0"
                loading="lazy"
              />
            ) : (
              <Image
                key={current.id}
                src={current.src || '/placeholder.svg'}
                alt={current.alt}
                width={540}
                height={1140}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        {PREVIEW_URL ? null : (
          <p className="max-w-md text-center text-xs text-muted-foreground">
            Want the fully interactive demo with a working Jarvis AI chat? Deploy
            the app in the <code className="rounded bg-secondary px-1">preview/</code>{' '}
            folder and set <code className="rounded bg-secondary px-1">NEXT_PUBLIC_PREVIEW_URL</code>{' '}
            to its URL — it will load right inside this phone.
          </p>
        )}
      </div>
    </section>
  )
}
