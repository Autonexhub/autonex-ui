import { useEffect, useMemo, useRef, useState } from "react"
import { hierarchy, pack } from "d3-hierarchy"
import { Plus, Minus, ArrowCounterClockwise } from "@phosphor-icons/react"
import { ChartEmptyState } from "../molecules/empty-state"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

export interface TopicData {
  name: string
  count: number
  percentage: number
  color: string
}

export interface TopicsBubbleChartLabels {
  noData: string
  zoomIn: string
  zoomOut: string
  reset: string
}

export const DEFAULT_TOPICS_BUBBLE_CHART_LABELS: TopicsBubbleChartLabels = {
  noData: "Sin datos disponibles",
  zoomIn: "Acercar",
  zoomOut: "Alejar",
  reset: "Restablecer",
}

export interface TopicsBubbleChartProps {
  data: TopicData[]
  height?: number
  zoomable?: boolean
  /** Pinta el skeleton en lugar de las burbujas mientras llegan los datos. */
  loading?: boolean
  labels?: Partial<TopicsBubbleChartLabels>
}

type Datum = { topic?: string; value?: number; children?: { topic: string; value: number }[] }

const COLORS = ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5", "--chart-6"]

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

export const TopicsBubbleChart = ({
  data,
  height = 320,
  zoomable = false,
  loading = false,
  labels: labelsProp,
}: TopicsBubbleChartProps) => {
  const labels = { ...DEFAULT_TOPICS_BUBBLE_CHART_LABELS, ...labelsProp }
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const [size, setSize] = useState(380)
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 })

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        setSize(Math.min(width, height))
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [height])

  useEffect(() => {
    const el = svgRef.current
    if (!el || !zoomable) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const mx = ((e.clientX - rect.left) / rect.width) * size
      const my = ((e.clientY - rect.top) / rect.height) * size
      setTransform((prev) => {
        const k = clamp(prev.k * (e.deltaY < 0 ? 1.12 : 1 / 1.12), 1, 6)
        const f = k / prev.k
        return { k, x: mx - (mx - prev.x) * f, y: my - (my - prev.y) * f }
      })
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [zoomable, size])

  const zoomBy = (f: number) =>
    setTransform((prev) => {
      const k = clamp(prev.k * f, 1, 6)
      const c = size / 2
      const r = k / prev.k
      return { k, x: c - (c - prev.x) * r, y: c - (c - prev.y) * r }
    })

  const topics = useMemo(() => data.map((d) => ({ topic: d.name, value: d.count })), [data])

  const nodes = useMemo(() => {
    if (topics.length === 0) return []
    const root = hierarchy<Datum>({ children: topics }).sum((d) => d.value ?? 0)
    return pack<Datum>().size([size, size]).padding(4)(root).leaves()
  }, [topics, size])

  if (loading) {
    return (
      <div className="relative flex w-full items-center justify-center" style={{ height }}>
        <div className="flex items-end gap-3">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-28 w-28 rounded-full" />
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <ChartEmptyState title={labels.noData} height={height} />
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div ref={containerRef} className="relative w-full" style={{ height }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${size} ${size}`}
          className={`h-full w-full select-none ${
            zoomable ? "cursor-grab touch-none active:cursor-grabbing" : ""
          }`}
          onPointerDown={(e) => {
            if (!zoomable) return
            drag.current = { x: e.clientX, y: e.clientY }
            e.currentTarget.setPointerCapture(e.pointerId)
          }}
          onPointerMove={(e) => {
            if (!zoomable || !drag.current) return
            const rect = e.currentTarget.getBoundingClientRect()
            const dx = ((e.clientX - drag.current.x) / rect.width) * size
            const dy = ((e.clientY - drag.current.y) / rect.height) * size
            drag.current = { x: e.clientX, y: e.clientY }
            setTransform((p) => ({ ...p, x: p.x + dx, y: p.y + dy }))
          }}
          onPointerUp={() => (drag.current = null)}
        >
          <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
            {nodes.map((n, i) => {
              const color = `var(${COLORS[i % COLORS.length]})`
              const fs = clamp(n.r / 3.6, 8, 20)
              const showLabel = n.r >= 20
              const showValue = n.r >= 28
              return (
                <g key={n.data.topic}>
                  <circle cx={n.x} cy={n.y} r={n.r} fill={color} fillOpacity={0.2} />
                  <UiTooltip>
                    <TooltipTrigger asChild>
                      <circle cx={n.x} cy={n.y} r={n.r} fill="transparent" className="cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="font-medium">{n.data.topic}</span>
                      <span className="tabular-nums opacity-70">{n.data.value}</span>
                    </TooltipContent>
                  </UiTooltip>
                  {showLabel ? (
                    <foreignObject
                      x={n.x - n.r}
                      y={n.y - n.r}
                      width={n.r * 2}
                      height={n.r * 2}
                      className="pointer-events-none select-none"
                    >
                      <div
                        className="flex h-full w-full flex-col items-center justify-center px-1 text-center leading-tight"
                        style={{ fontSize: fs }}
                      >
                        <span className="font-medium text-foreground">{n.data.topic}</span>
                        {showValue ? (
                          <span className="text-muted-foreground tabular-nums" style={{ fontSize: fs * 0.85 }}>
                            {n.data.value}
                          </span>
                        ) : null}
                      </div>
                    </foreignObject>
                  ) : null}
                </g>
              )
            })}
          </g>
        </svg>

        {zoomable && (
          <div className="absolute right-2 bottom-2 flex flex-col gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" aria-label={labels.zoomIn} onClick={() => zoomBy(1.25)}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" aria-label={labels.zoomOut} onClick={() => zoomBy(1 / 1.25)}>
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              aria-label={labels.reset}
              onClick={() => setTransform({ k: 1, x: 0, y: 0 })}
            >
              <ArrowCounterClockwise className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
