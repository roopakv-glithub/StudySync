import { Bot, FileText, MessageSquare, CalendarClock } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { StatsDownload } from '@/components/stats-download'
import { FeaturesOverview } from '@/components/features-overview'
import { FeatureSection } from '@/components/feature-section'
import { LivePreview } from '@/components/live-preview'
import { AlertsSection } from '@/components/alerts-section'
import { CtaSection } from '@/components/cta-section'
import { Testimonials } from '@/components/testimonials'
import { FeedbackSection } from '@/components/feedback-section'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <StatsDownload />
        <FeaturesOverview />

        <FeatureSection
          id="jarvis"
          icon={Bot}
          eyebrow="Context-Aware Mentorship"
          title="Meet Jarvis, an AI that knows your schedule"
          description="Engage with Jarvis, an AI engineered by Roopak that actually knows your schedule. It cross-references your uploaded notes and upcoming deadlines to build custom study plans and solve subject-specific doubts in real time."
          bullets={[
            'Plan your day around your real tasks and deadlines',
            'Deep-dive discussions powered by your own notes',
            'Instant answers drawn directly from your modules',
          ]}
          image="/screens/ai.jpeg"
          imageAlt="Jarvis AI assistant chat offering to schedule a day, discuss studies, and answer doubts"
        />

        <FeatureSection
          id="notes"
          icon={FileText}
          eyebrow="Autonomous Note Synthesis"
          title="Turn static PDFs into active knowledge"
          description="Simply upload modules to your Subject Folders and our automated OCR pipeline extracts the text, aggregating everything into a single Master Study Box for instant reading and AI analysis."
          bullets={[
            'Organized subject folders for every course',
            'OCR pipeline converts PDFs into searchable text',
            'A unified Master Study Box for instant review',
          ]}
          image="/screens/material.jpeg"
          imageAlt="Study Materials screen with Java, Discrete Maths, and Database System subject folders"
          reverse
        />

        <FeatureSection
          id="chat"
          icon={MessageSquare}
          eyebrow="High-Fidelity Group Sync"
          title="Coordinate your team in real time"
          description="A professional, WhatsApp-Elite interface built on a real-time WebSocket fabric enables multilateral group chat and secure private messaging with instant file sharing and avatar-based identification."
          bullets={[
            'Group study rooms plus private direct messages',
            'Instant file sharing between teammates',
            'Avatar-based identification keeps chats clear',
          ]}
          image="/screens/chat.jpeg"
          imageAlt="Chat screen with a Group Study Room and direct messages list"
        />

        <FeatureSection
          id="calendar"
          icon={CalendarClock}
          eyebrow="Predictive Deadline Integrity"
          title="Master your curriculum at a glance"
          description="Visualize your entire month with an interactive scheduling matrix. Click any date to see its tasks and stay ahead with automated, high-priority email reminders before every deadline."
          bullets={[
            'Interactive month view with task highlights',
            'Tap a date to reveal everything that is due',
            'Automated email reminders keep you on track',
          ]}
          image="/screens/dashboard.jpeg"
          imageAlt="Home dashboard with task stats and an interactive monthly calendar"
          reverse
        />

        <LivePreview />
        <AlertsSection />
        <CtaSection />
        <Testimonials />
        <FeedbackSection />
      </main>
      <SiteFooter />
    </div>
  )
}
