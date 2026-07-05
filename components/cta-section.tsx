import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PhoneFrame } from '@/components/phone-frame'

export function CtaSection() {
  return (
    <section id="cta" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 sm:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="max-w-xl">
            <span className="text-sm font-semibold text-primary-foreground/80">
              Engineered for Excellence
            </span>
            <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to synchronize your studies?
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-primary-foreground/85">
              StudySync is more than an app — it&apos;s the ultimate synthesis of
              automation and productivity, built to synchronize your team and
              amplify your results.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                variant="secondary"
                nativeButton={false}
                className="rounded-full bg-background px-6 font-semibold text-foreground hover:bg-background/90"
                render={<a href="#top" />}
              >
                Start studying smarter
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <PhoneFrame
              src="/screens/login.jpeg"
              alt="StudySync sign-in screen to start studying smarter"
              className="rotate-1"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
