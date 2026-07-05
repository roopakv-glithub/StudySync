import type { LucideIcon } from 'lucide-react'
import { Check } from 'lucide-react'
import { PhoneFrame } from '@/components/phone-frame'
import { cn } from '@/lib/utils'

interface FeatureSectionProps {
  id: string
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  image: string
  imageAlt: string
  reverse?: boolean
}

export function FeatureSection({
  id,
  icon: Icon,
  eyebrow,
  title,
  description,
  bullets,
  image,
  imageAlt,
  reverse,
}: FeatureSectionProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Phone */}
        <div
          className={cn(
            'relative flex justify-center',
            reverse ? 'lg:order-2 lg:justify-end' : 'lg:justify-start',
          )}
        >
          <div
            className="absolute inset-0 -z-10 mx-auto h-72 w-72 self-center rounded-full bg-muted blur-2xl"
            aria-hidden="true"
          />
          <PhoneFrame src={image} alt={imageAlt} className={reverse ? '-rotate-1' : 'rotate-1'} />
        </div>

        {/* Copy */}
        <div className={cn('max-w-xl', reverse && 'lg:order-1')}>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Icon className="size-3.5" aria-hidden="true" />
            {eyebrow}
          </span>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed text-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
