import { GraduationCap } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                StudySync
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              An Intelligent Study Ecosystem designed to synchronize your team
              and amplify your results. Created by Roopak.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Product</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#jarvis" className="hover:text-foreground">Jarvis AI</a></li>
                <li><a href="#notes" className="hover:text-foreground">Notes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Company</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#top" className="hover:text-foreground">About</a></li>
                <li><a href="#alerts" className="hover:text-foreground">Alerts</a></li>
                <li><a href="#cta" className="hover:text-foreground">Get Started</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Support</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} StudySync. Built by Roopak. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
