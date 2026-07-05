import { BellRing, Clock, Mail, ShieldAlert } from 'lucide-react'

export function AlertsSection() {
  return (
    <section id="alerts" className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold text-primary">Never miss a deadline</span>
        <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Automated Notification Matrix
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Stay ahead with predictive deadline integrity — high-priority email
          reminders dispatched exactly when you need them.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-7">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
            <BellRing className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
            The 24-Hour Heads-Up
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A high-priority email reminder is sent 24 hours before any task is
            due, so you always have time to prepare.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
            <Clock className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
            The 1-Hour Final Alert
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A final warning is dispatched 1 hour before a deadline, keeping your
            focus sharp during the critical final stretch.
          </p>
        </div>
      </div>

      {/* Security note */}
      <div className="mt-6 rounded-2xl border border-primary/30 bg-secondary p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldAlert className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Stay Connected. Secure your alerts.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">
              To make sure you never miss a reminder, open your Gmail settings and:
            </p>
            <ol className="mt-3 space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  1
                </span>
                Remove{' '}
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  <Mail className="size-3.5 text-primary" aria-hidden="true" />
                  studysync1808@gmail.com
                </span>{' '}
                from your Spam folder.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  2
                </span>
                Add this address to your Contacts / Safe Sender list.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
