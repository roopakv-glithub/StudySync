import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PhoneFrame } from '@/components/phone-frame'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-2">
        {/* Copy */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            <Sparkles className="size-3.5" aria-hidden="true" />
            An Intelligent Study Ecosystem
          </span>

          <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Study smarter with{' '}
            <span className="text-primary">StudySync</span>.
          </h1>

          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            The all-in-one app that synchronizes your notes, schedule, team, and
            an AI mentor that actually knows your deadlines. Created by Roopak to
            amplify your results.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              className="rounded-full px-6 font-semibold"
              render={<a href="#cta" />}
            >
              Get Started Free
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              className="rounded-full px-6 font-semibold"
              render={<a href="#features" />}
            >
              Explore Features
            </Button>
          </div>

        </div>

        {/* Phone mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <div
            className="absolute inset-0 -z-10 mx-auto h-80 w-80 rounded-full bg-accent blur-2xl lg:h-96 lg:w-96"
            aria-hidden="true"
          />
          <PhoneFrame
            src="/screens/dashboard.jpeg"
            alt="StudySync home dashboard showing task stats, Ask Jarvis AI, and a monthly schedule"
            priority
            className="rotate-1"
          />
          <div className="absolute -left-2 bottom-16 hidden w-44 rounded-2xl border border-border bg-card p-3 shadow-xl shadow-foreground/10 sm:block">
            <p className="text-xs font-medium text-muted-foreground">Reminder</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              DA-1 due in 24 hours
            </p>
            <span className="mt-2 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
              Email sent
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
