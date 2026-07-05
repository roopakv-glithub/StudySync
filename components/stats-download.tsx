'use client'

import { useEffect, useState } from 'react'
import { Download, Users, ArrowDownToLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getDownloadCount, incrementDownloadCount } from '@/lib/supabase'

const APK_PATH = '/studysync.apk'

function formatCount(n: number) {
  return new Intl.NumberFormat('en-US').format(n)
}

export function StatsDownload() {
  const [count, setCount] = useState<number | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    let active = true
    getDownloadCount().then((c) => {
      if (active) setCount(c)
    })
    return () => {
      active = false
    }
  }, [])

  async function handleDownload() {
    setDownloading(true)
    // Optimistically bump the visible number, then confirm with the DB.
    setCount((c) => (c === null ? c : c + 1))
    const updated = await incrementDownloadCount()
    if (updated !== null) setCount(updated)

    // Trigger the APK download.
    const link = document.createElement('a')
    link.href = APK_PATH
    link.download = 'StudySync.apk'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setDownloading(false)
  }

  const display = count === null ? '—' : formatCount(count)

  return (
    <section id="download" className="mx-auto max-w-6xl px-5 pt-4 pb-12 md:pb-16">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          {/* Numbers */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                <ArrowDownToLine className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl tabular-nums">
                  {display}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  Downloads
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                <Users className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl tabular-nums">
                  {display}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  Active students
                </p>
              </div>
            </div>
          </div>

          {/* Download CTA */}
          <div className="flex flex-col items-start gap-2 lg:items-end">
            <Button
              size="lg"
              onClick={handleDownload}
              disabled={downloading}
              className="rounded-full px-7 font-semibold"
            >
              <Download className="size-4" aria-hidden="true" />
              {downloading ? 'Starting…' : 'Download for Android'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Free APK • Android 8.0+
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
