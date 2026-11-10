import { useEffect, useRef, useState } from "react"
import confetti from "canvas-confetti"

const COLORS = ["#5e6ad2", "#26b87a", "#f2c94c", "#eb5757", "#9b51e0", "#56ccf2"]

export const DEFAULT_CELEBRATION_MESSAGE = "¡Día completado!"

/** Small burst at the cursor position when toggling a single issue done. */
export function MicroConfetti({ x, y }: { x: number; y: number }) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    const origin = { x: x / window.innerWidth, y: y / window.innerHeight }
    confetti({
      particleCount: 38,
      spread: 70,
      startVelocity: 28,
      gravity: 0.9,
      ticks: 80,
      origin,
      colors: COLORS,
      scalar: 0.7,
      disableForReducedMotion: true,
    })
  }, [x, y])
  return null
}

export interface BigCelebrationProps {
  /** Texto de la píldora (por defecto `DEFAULT_CELEBRATION_MESSAGE`). */
  message?: string
  onDone?: () => void
}

/**
 * Big celebration overlay shown when ALL items in a group are completed.
 * Uses canvas-confetti for sustained side-cannons + fireworks burst, plus a
 * clean toast pill that slides in from above.
 */
export function BigCelebration({ message, onDone }: BigCelebrationProps) {
  const displayMessage = message ?? DEFAULT_CELEBRATION_MESSAGE
  const [exit, setExit] = useState(false)

  useEffect(() => {
    // Center fireworks burst at start
    confetti({
      particleCount: 90,
      spread: 100,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.45 },
      colors: COLORS,
      ticks: 250,
      disableForReducedMotion: true,
    })

    // Sustained side cannons for ~2s
    const duration = 2000
    const end = Date.now() + duration
    let cancelled = false
    const frame = () => {
      if (cancelled || Date.now() > end) return
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 60,
        startVelocity: 55,
        origin: { x: 0, y: 0.85 },
        colors: COLORS,
        scalar: 0.9,
        gravity: 0.95,
        ticks: 220,
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 60,
        startVelocity: 55,
        origin: { x: 1, y: 0.85 },
        colors: COLORS,
        scalar: 0.9,
        gravity: 0.95,
        ticks: 220,
        disableForReducedMotion: true,
      })
      setTimeout(frame, 80)
    }
    frame()

    const t1 = setTimeout(() => setExit(true), 2400)
    const t2 = setTimeout(() => onDone?.(), 3000)
    return () => {
      cancelled = true
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])

  return (
    <div className="fixed inset-x-0 top-20 pointer-events-none z-[200] flex justify-center">
      <div
        className={[
          "bg-foreground text-background px-5 py-3 rounded-xl shadow-2xl",
          "flex items-center gap-3 text-card-title font-medium tracking-tight",
          "transition-all duration-500 ease-out",
          exit ? "opacity-0 -translate-y-3 scale-95" : "opacity-100 translate-y-0 scale-100",
          "animate-celebration-in",
        ].join(" ")}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        {displayMessage}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes celebration-in {
          0%   { opacity: 0; transform: translateY(-16px) scale(0.92); }
          60%  { opacity: 1; transform: translateY(2px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-celebration-in { animation: celebration-in 480ms cubic-bezier(.34,1.56,.64,1) both; }
      `,
        }}
      />
    </div>
  )
}
