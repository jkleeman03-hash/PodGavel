import { cn } from '@/lib/utils'

// A decorative animated audio waveform — the signature motif of PodGavel.
// Bar heights are fixed so server/client render matches; CSS drives the motion.
const BARS = [
  38, 62, 90, 54, 30, 72, 100, 46, 68, 34, 82, 58, 24, 76, 44, 96, 52, 40, 66,
  30, 88, 50, 70, 36,
]

export function Waveform({
  className,
  barClassName,
  animate = true,
}: {
  className?: string
  barClassName?: string
  animate?: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('flex items-center gap-[3px]', className)}
    >
      {BARS.map((height, i) => (
        <span
          key={i}
          className={cn(
            'w-[3px] rounded-full bg-primary/70',
            animate && 'motion-safe:animate-wave',
            barClassName,
          )}
          style={{
            height: `${height}%`,
            animationDelay: `${(i % 8) * 0.12}s`,
          }}
        />
      ))}
    </div>
  )
}
