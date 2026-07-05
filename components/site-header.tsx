import { GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Jarvis AI', href: '#jarvis' },
  { label: 'Notes', href: '#notes' },
  { label: 'Alerts', href: '#alerts' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            StudySync
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            nativeButton={false}
            className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
            render={<a href="#top" />}
          >
            Sign in
          </Button>
          <Button
            className="rounded-full font-semibold"
            nativeButton={false}
            render={<a href="#cta" />}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}
