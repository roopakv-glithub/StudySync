import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PhoneFrameProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function PhoneFrame({ src, alt, className, priority }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        'relative w-[248px] shrink-0 rounded-[2.5rem] border-[6px] border-foreground/90 bg-foreground/90 shadow-2xl shadow-foreground/10',
        className,
      )}
    >
      {/* notch */}
      <div className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-background/40" />
      <div className="overflow-hidden rounded-[2rem] bg-background">
        <Image
          src={src || '/placeholder.svg'}
          alt={alt}
          width={520}
          height={1100}
          priority={priority}
          className="h-auto w-full"
        />
      </div>
    </div>
  )
}
