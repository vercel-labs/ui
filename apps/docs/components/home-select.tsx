"use client"

import { cn } from "cn"
import * as React from "react"

const behaviors = [
  { name: "createPopup", body: "Open. Position. Dismiss." },
  { name: "createListbox", body: "Navigate and select." },
  { name: "createTypeahead", body: "Type to jump." },
]

const mono = "font-mono text-[9px] tracking-[0.06em] uppercase"
const guide = "stroke-foreground/30 [stroke-dasharray:3_3]"
const fade = "transition-[fill,stroke] duration-200"

function Tag({
  index,
  y,
  from,
  name,
  lit,
  onHover,
}: {
  index: number
  y: number
  from: [number, number]
  name: string
  lit: boolean
  onHover: (index: number | null) => void
}) {
  return (
    <g
      onPointerEnter={(event) => event.pointerType === "mouse" && onHover(index)}
      onPointerLeave={(event) => event.pointerType === "mouse" && onHover(null)}
      onPointerUp={(event) => event.pointerType !== "mouse" && onHover(lit ? null : index)}
      className="cursor-default"
    >
      <rect x={from[0]} y={y - 12} width={140} height={Math.max(24, from[1] - y + 16)} className="fill-transparent" />
      <circle cx={from[0]} cy={from[1]} r={2.5} className={cn(fade, lit ? "fill-[#006bff]" : "fill-foreground")} />
      <path
        d={`M${from[0]},${from[1]} H${from[0] + 14} L398,${y}`}
        className={cn(fade, "fill-none", lit ? "stroke-[#006bff]" : "stroke-foreground")}
      />
      <rect x={398} y={y - 9} width={18} height={18} className={cn(fade, lit ? "fill-[#006bff]" : "fill-foreground")} />
      <text x={407} y={y + 3.5} textAnchor="middle" className={cn(mono, "fill-background")}>
        {index}
      </text>
      <text x={424} y={y + 3.5} className={cn(mono, fade, lit ? "fill-[#006bff]" : "fill-muted-foreground")}>
        {name}
      </text>
    </g>
  )
}

function Ticks({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const tick = (x: number, y: number) => (x1 === x2 ? `M${x - 5},${y} H${x + 5}` : `M${x},${y - 5} V${y + 5}`)
  return <path d={`M${x1},${y1} L${x2},${y2} ${tick(x1, y1)} ${tick(x2, y2)}`} className="fill-none stroke-foreground" />
}

function Drawing({ active, onHover }: { active: number | null; onHover: (index: number | null) => void }) {
  const edge = (index: number) => cn(fade, active === index ? "stroke-[#006bff]" : "stroke-foreground")
  return (
    <svg
      viewBox="0 0 500 324"
      role="img"
      aria-label="A Select drawn as a blueprint: the button, the popup it opens, three options with Production highlighted, and the letters P, R and O typed to jump to it."
      className="hidden h-auto w-full max-w-[43rem] self-center overflow-visible @[30rem]:block"
    >
      <path d="M60,16 V304 M360,16 V304 M24,100 H60 M24,108 H60" className={cn(guide, "fill-none")} />

      <Ticks x1={60} y1={34} x2={360} y2={34} />
      <rect x={164} y={28} width={92} height={12} className="fill-(--poster)" />
      <text x={210} y={37} textAnchor="middle" className={cn(mono, "fill-muted-foreground")}>
        anchor width
      </text>

      <rect x={60} y={52} width={300} height={48} className="fill-background stroke-foreground" />
      <text x={76} y={81} className="fill-foreground text-[15px]">
        Staging
      </text>
      <path d="M334,73 l5,5 l5,-5" className="fill-none stroke-foreground" />

      <Ticks x1={376} y1={100} x2={376} y2={108} />
      <text x={384} y={107} className={cn(mono, "fill-muted-foreground")}>
        8
      </text>

      <rect x={60} y={108} width={300} height={144} className={cn(edge(1), "fill-background")} />
      <text x={76} y={142} className="fill-foreground text-[14px]">
        Development
      </text>
      <text x={76} y={186} className="fill-foreground text-[14px]">
        Staging
      </text>
      <rect
        x={64}
        y={112}
        width={292}
        height={140}
        className={cn(fade, active === 2 ? "fill-[#006bff]/10" : "fill-transparent")}
      />
      <path d="M334,182 l4,4 l7,-8" className="fill-none stroke-foreground" />
      <rect x={64} y={204} width={292} height={44} className="fill-foreground" />
      <text x={76} y={230} className="fill-background text-[14px]">
        <tspan className={cn(fade, active === 3 && "fill-[#006bff]")}>Pro</tspan>
        duction
      </text>
      <path d="M76,236 h26" className={cn(fade, "fill-none", active === 3 ? "stroke-[#006bff]" : "stroke-transparent")} />
      <rect x={64} y={112} width={292} height={140} className={cn(fade, "fill-none", active === 2 ? "stroke-[#006bff]" : "stroke-transparent")} />

      <Ticks x1={40} y1={204} x2={40} y2={248} />
      <text x={32} y={229} textAnchor="end" className={cn(mono, "fill-muted-foreground")}>
        44
      </text>

      {["P", "R", "O"].map((key, index) => (
        <g key={key}>
          <rect x={272 + index * 28} y={276} width={22} height={22} className={cn(edge(3), "fill-background")} />
          <text
            x={283 + index * 28}
            y={290.5}
            textAnchor="middle"
            className={cn(mono, fade, active === 3 ? "fill-[#006bff]" : "fill-foreground")}
          >
            {key}
          </text>
        </g>
      ))}
      <path d="M339,274 V258 M335,262 L339,256 L343,262" className={cn(edge(3), "fill-none")} />

      <Tag index={1} y={116} from={[360, 132]} name="popup" lit={active === 1} onHover={onHover} />
      <Tag index={2} y={182} from={[356, 182]} name="listbox" lit={active === 2} onHover={onHover} />
      <Tag index={3} y={287} from={[350, 287]} name="typeahead" lit={active === 3} onHover={onHover} />

      <text x={60} y={322} className={cn(mono, "fill-muted-foreground")}>
        Select · 1:1
      </text>
    </svg>
  )
}

function Mark({
  index,
  y,
  from,
  lit,
  onHover,
}: {
  index: number
  y: number
  from: [number, number]
  lit: boolean
  onHover: (index: number | null) => void
}) {
  return (
    <g onPointerUp={(event) => event.pointerType !== "mouse" && onHover(lit ? null : index)} className="cursor-default">
      <rect x={from[0]} y={y - 16} width={280 - from[0]} height={32} className="fill-transparent" />
      <circle cx={from[0]} cy={from[1]} r={2.5} className={cn(fade, lit ? "fill-[#006bff]" : "fill-foreground")} />
      <path
        d={`M${from[0]},${from[1]} L256,${y}`}
        className={cn(fade, "fill-none", lit ? "stroke-[#006bff]" : "stroke-foreground")}
      />
      <rect x={256} y={y - 9} width={18} height={18} className={cn(fade, lit ? "fill-[#006bff]" : "fill-foreground")} />
      <text x={265} y={y + 3.5} textAnchor="middle" className={cn(mono, "fill-background")}>
        {index}
      </text>
    </g>
  )
}

function PhoneDrawing({ active, onHover }: { active: number | null; onHover: (index: number | null) => void }) {
  const edge = (index: number) => cn(fade, active === index ? "stroke-[#006bff]" : "stroke-foreground")
  return (
    <svg
      viewBox="-1 0 278 292"
      role="img"
      aria-label="A Select drawn as a blueprint: the button, the popup it opens, three options with Production highlighted, and the letters P, R and O typed to jump to it."
      className="h-auto w-full overflow-visible @[30rem]:hidden"
    >
      <Ticks x1={0} y1={12} x2={240} y2={12} />
      <rect x={74} y={6} width={92} height={12} className="fill-(--poster)" />
      <text x={120} y={15} textAnchor="middle" className={cn(mono, "fill-muted-foreground")}>
        anchor width
      </text>

      <rect x={0} y={28} width={240} height={44} className="fill-background stroke-foreground" />
      <text x={14} y={55} className="fill-foreground text-[15px]">
        Staging
      </text>
      <path d="M216,47 l5,5 l5,-5" className="fill-none stroke-foreground" />

      <rect x={0} y={80} width={240} height={140} className={cn(edge(1), "fill-background")} />
      <text x={14} y={111} className="fill-foreground text-[14px]">
        Development
      </text>
      <text x={14} y={155} className="fill-foreground text-[14px]">
        Staging
      </text>
      <rect x={4} y={84} width={232} height={132} className={cn(fade, active === 2 ? "fill-[#006bff]/10" : "fill-transparent")} />
      <path d="M216,151 l4,4 l7,-8" className="fill-none stroke-foreground" />
      <rect x={4} y={172} width={232} height={44} className="fill-foreground" />
      <text x={14} y={199} className="fill-background text-[14px]">
        <tspan className={cn(fade, active === 3 && "fill-[#006bff]")}>Pro</tspan>
        duction
      </text>
      <path d="M14,205 h26" className={cn(fade, "fill-none", active === 3 ? "stroke-[#006bff]" : "stroke-transparent")} />
      <rect
        x={4}
        y={84}
        width={232}
        height={132}
        className={cn(fade, "fill-none", active === 2 ? "stroke-[#006bff]" : "stroke-transparent")}
      />

      {["P", "R", "O"].map((key, index) => (
        <g key={key}>
          <rect x={150 + index * 28} y={240} width={22} height={22} className={cn(edge(3), "fill-background")} />
          <text
            x={161 + index * 28}
            y={254.5}
            textAnchor="middle"
            className={cn(mono, fade, active === 3 ? "fill-[#006bff]" : "fill-foreground")}
          >
            {key}
          </text>
        </g>
      ))}
      <path d="M217,238 V222 M213,226 L217,220 L221,226" className={cn(edge(3), "fill-none")} />

      <Mark index={1} y={96} from={[240, 96]} lit={active === 1} onHover={onHover} />
      <Mark index={2} y={151} from={[236, 151]} lit={active === 2} onHover={onHover} />
      <Mark index={3} y={251} from={[228, 251]} lit={active === 3} onHover={onHover} />

      <text x={0} y={290} className={cn(mono, "fill-muted-foreground")}>
        Select · 1:1
      </text>
    </svg>
  )
}

function SelectBlueprint() {
  const [active, setActive] = React.useState<number | null>(null)
  return (
    <div className="flex flex-1 flex-col justify-center gap-10 select-none [-webkit-touch-callout:none]">
      <PhoneDrawing active={active} onHover={setActive} />
      <Drawing active={active} onHover={setActive} />
      <ol className="grid gap-6 @[34rem]:grid-cols-3 @[34rem]:gap-4">
        {behaviors.map((behavior, index) => (
          <li
            key={behavior.name}
            onPointerEnter={(event) => event.pointerType === "mouse" && setActive(index + 1)}
            onPointerLeave={(event) => event.pointerType === "mouse" && setActive(null)}
            onPointerUp={(event) => event.pointerType !== "mouse" && setActive(active === index + 1 ? null : index + 1)}
            className="flex gap-3"
          >
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 flex size-[18px] shrink-0 items-center justify-center font-mono text-[9px] text-background transition-colors duration-200",
                active === index + 1 ? "bg-[#006bff]" : "bg-foreground",
              )}
            >
              {index + 1}
            </span>
            <span className="flex flex-col gap-1">
              <code
                className={cn(
                  "font-mono text-[17px] leading-tight transition-colors duration-200",
                  active === index + 1 && "text-[#006bff]",
                )}
              >
                {behavior.name}
              </code>
              <span className="text-sm text-muted-foreground">{behavior.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export { SelectBlueprint }
