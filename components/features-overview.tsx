import { Bot, FileText, MessageSquare, CalendarClock } from 'lucide-react'

const items = [
  {
    icon: Bot,
    title: 'Jarvis AI Mentor',
    desc: 'A context-aware assistant that knows your schedule and notes.',
  },
  {
    icon: FileText,
    title: 'Note Synthesis',
    desc: 'Upload PDFs and let OCR turn them into a Master Study Box.',
  },
  {
    icon: MessageSquare,
    title: 'Elite Group Chat',
    desc: 'Real-time group and private messaging with file sharing.',
  },
  {
    icon: CalendarClock,
    title: 'Smart Calendar',
    desc: 'Visualize deadlines and get timely email reminders.',
  },
]

export function FeaturesOverview() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold text-primary">Everything in one place</span>
        <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          A complete toolkit for focused studying
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Four powerful systems working together to synchronize your team and
          keep you ahead of every deadline.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
