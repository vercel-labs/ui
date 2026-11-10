"use client"

import { cn } from "cn"
import * as React from "react"

const behaviors = [
  { name: "createPopup", part: "popup", body: "Open. Position. Dismiss." },
  { name: "createSelection", part: "listbox", body: "Select one or many." },
  { name: "createTypeahead", part: "typeahead", body: "Type to jump." },
]

const options = ["Development", "Staging", "Production"]

const mono = "font-mono text-[9px] tracking-[0.06em] uppercase"
const guide = "stroke-foreground/30 [stroke-dasharray:3_3]"
const fade = "transition-[fill,stroke] duration-200"

type Layout = {
  viewBox: string
  x: number
  w: number
  top: number
  trigger: number
  popup: number
  tag: number
  wide: boolean
}

const wide: Layout = {
  viewBox: "0 0 500 324",
  x: 60,
  w: 300,
  top: 34,
  trigger: 52,
  popup: 108,
  tag: 398,
  wide: true,
}

const narrow: Layout = {
  viewBox: "-1 0 278 292",
  x: 0,
  w: 240,
  top: 12,
  trigger: 28,
  popup: 80,
  tag: 256,
  wide: false,
}

function Ticks({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
}) {
  const tick = (x: number, y: number) =>
    x1 === x2 ? `M${x - 5},${y} H${x + 5}` : `M${x},${y - 5} V${y + 5}`
  return (
    <path
      d={`M${x1},${y1} L${x2},${y2} ${tick(x1, y1)} ${tick(x2, y2)}`}
      className="fill-none stroke-foreground"
    />
  )
}

function Tag({
  index,
  y,
  from,
  layout,
  lit,
  onPick,
}: {
  index: number
  y: number
  from: [number, number]
  layout: Layout
  lit: boolean
  onPick: (index: number) => void
}) {
  const x = layout.tag
  return (
    <g onClick={() => onPick(index)} className="cursor-default">
      <rect
        x={from[0]}
        y={y - 16}
        width={(layout.wide ? 140 : 24) + x - from[0]}
        height={Math.max(32, from[1] - y + 20)}
        className="fill-transparent"
      />
      <circle
        cx={from[0]}
        cy={from[1]}
        r={2.5}
        className={cn(fade, lit ? "fill-[#006bff]" : "fill-foreground")}
      />
      <path
        d={
          layout.wide
            ? `M${from[0]},${from[1]} H${from[0] + 14} L${x},${y}`
            : `M${from[0]},${from[1]} L${x},${y}`
        }
        className={cn(
          fade,
          "fill-none",
          lit ? "stroke-[#006bff]" : "stroke-foreground"
        )}
      />
      <rect
        x={x}
        y={y - 9}
        width={18}
        height={18}
        className={cn(fade, lit ? "fill-[#006bff]" : "fill-foreground")}
      />
      <text
        x={x + 9}
        y={y + 3.5}
        textAnchor="middle"
        className={cn(mono, "fill-background")}
      >
        {index}
      </text>
      {layout.wide && (
        <text
          x={x + 26}
          y={y + 3.5}
          className={cn(
            mono,
            fade,
            lit ? "fill-[#006bff]" : "fill-muted-foreground"
          )}
        >
          {behaviors[index - 1]!.part}
        </text>
      )}
    </g>
  )
}

function Drawing({
  layout,
  active,
  onPick,
  className,
}: {
  layout: Layout
  active: number
  onPick: (index: number) => void
  className?: string
}) {
  const { x, w, trigger, popup } = layout
  const height = layout.wide ? 48 : 44
  const row = (index: number) => popup + 6 + index * 44
  const bottom = popup + 144
  const keys = x + w - 88
  const keyY = bottom + 22
  const edge = (index: number) =>
    cn(fade, active === index ? "stroke-[#006bff]" : "stroke-foreground")
  return (
    <svg
      viewBox={layout.viewBox}
      role="img"
      aria-label="A Select drawn as a blueprint: the button, the popup it opens, three options with Production highlighted, and the letters P, R and O typed to jump to it."
      className={cn("h-auto w-full overflow-visible", className)}
    >
      {layout.wide && (
        <path
          d={`M${x},16 V304 M${x + w},16 V304 M24,${trigger + height} H${x} M24,${popup} H${x}`}
          className={cn(guide, "fill-none")}
        />
      )}

      <Ticks x1={x} y1={layout.top} x2={x + w} y2={layout.top} />
      <rect
        x={x + w / 2 - 46}
        y={layout.top - 6}
        width={92}
        height={12}
        className="fill-(--poster)"
      />
      <text
        x={x + w / 2}
        y={layout.top + 3}
        textAnchor="middle"
        className={cn(mono, "fill-muted-foreground")}
      >
        anchor width
      </text>

      <rect
        x={x}
        y={trigger}
        width={w}
        height={height}
        className="fill-background stroke-foreground"
      />
      <text
        x={x + 16}
        y={trigger + height / 2 + 5}
        className="fill-foreground text-[15px]"
      >
        Staging
      </text>
      <path
        d={`M${x + w - 26},${trigger + height / 2 - 3} l5,5 l5,-5`}
        className="fill-none stroke-foreground"
      />

      {layout.wide && (
        <>
          <Ticks
            x1={x + w + 16}
            y1={trigger + height}
            x2={x + w + 16}
            y2={popup}
          />
          <text
            x={x + w + 24}
            y={popup - 1}
            className={cn(mono, "fill-muted-foreground")}
          >
            8
          </text>
        </>
      )}

      <rect
        x={x}
        y={popup}
        width={w}
        height={144}
        className={cn(edge(1), "fill-background")}
      />
      <rect
        x={x + 4}
        y={popup + 4}
        width={w - 8}
        height={136}
        className={cn(
          fade,
          active === 2 ? "fill-[#006bff]/10" : "fill-transparent"
        )}
      />
      {options.map((option, index) => (
        <text
          key={option}
          x={x + 16}
          y={row(index) + 26}
          className="fill-foreground text-[14px]"
        >
          {option}
        </text>
      ))}
      <path
        d={`M${x + w - 26},${row(1) + 22} l4,4 l7,-8`}
        className="fill-none stroke-foreground"
      />
      <rect
        x={x + 4}
        y={row(2)}
        width={w - 8}
        height={44}
        className="fill-foreground"
      />
      <text x={x + 16} y={row(2) + 26} className="fill-background text-[14px]">
        <tspan className={cn(fade, active === 3 && "fill-[#006bff]")}>
          Pro
        </tspan>
        duction
      </text>
      <path
        d={`M${x + 16},${row(2) + 32} h26`}
        className={cn(
          fade,
          "fill-none",
          active === 3 ? "stroke-[#006bff]" : "stroke-transparent"
        )}
      />
      <rect
        x={x + 4}
        y={popup + 4}
        width={w - 8}
        height={136}
        className={cn(
          fade,
          "fill-none",
          active === 2 ? "stroke-[#006bff]" : "stroke-transparent"
        )}
      />

      {layout.wide && (
        <>
          <Ticks x1={40} y1={row(2)} x2={40} y2={row(2) + 44} />
          <text
            x={32}
            y={row(2) + 25}
            textAnchor="end"
            className={cn(mono, "fill-muted-foreground")}
          >
            44
          </text>
        </>
      )}

      {["P", "R", "O"].map((key, index) => (
        <g key={key}>
          <rect
            x={keys + index * 28}
            y={keyY}
            width={22}
            height={22}
            className={cn(edge(3), "fill-background")}
          />
          <text
            x={keys + 11 + index * 28}
            y={keyY + 14.5}
            textAnchor="middle"
            className={cn(
              mono,
              fade,
              active === 3 ? "fill-[#006bff]" : "fill-foreground"
            )}
          >
            {key}
          </text>
        </g>
      ))}
      <path
        d={`M${keys + 67},${keyY - 2} V${bottom + 6} M${keys + 63},${bottom + 10} L${keys + 67},${bottom + 4} L${keys + 71},${bottom + 10}`}
        className={cn(edge(3), "fill-none")}
      />

      <Tag
        index={1}
        y={layout.wide ? popup + 8 : popup + 16}
        from={[x + w, popup + (layout.wide ? 24 : 16)]}
        layout={layout}
        lit={active === 1}
        onPick={onPick}
      />
      <Tag
        index={2}
        y={row(1) + 22}
        from={[x + w - 4, row(1) + 22]}
        layout={layout}
        lit={active === 2}
        onPick={onPick}
      />
      <Tag
        index={3}
        y={keyY + 11}
        from={[keys + 78, keyY + 11]}
        layout={layout}
        lit={active === 3}
        onPick={onPick}
      />

      <text
        x={x}
        y={layout.wide ? 322 : 290}
        className={cn(mono, "fill-muted-foreground")}
      >
        Select · 1:1
      </text>
    </svg>
  )
}

function SelectBlueprint() {
  const [picked, setPicked] = React.useState(1)
  const [preview, setPreview] = React.useState<number | null>(null)
  const active = preview ?? picked
  return (
    <div className="flex flex-1 flex-col justify-center gap-10 select-none [-webkit-touch-callout:none]">
      <Drawing
        layout={narrow}
        active={active}
        onPick={setPicked}
        className="@[30rem]:hidden"
      />
      <Drawing
        layout={wide}
        active={active}
        onPick={setPicked}
        className="hidden max-w-[43rem] self-center @[30rem]:block"
      />
      <div
        role="group"
        aria-label="Behaviors in a Select"
        className="grid gap-2 @[35rem]:grid-cols-3"
        onPointerLeave={() => setPreview(null)}
      >
        {behaviors.map((behavior, index) => {
          const lit = active === index + 1
          return (
            <button
              key={behavior.name}
              type="button"
              aria-pressed={picked === index + 1}
              onPointerEnter={(event) =>
                event.pointerType === "mouse" && setPreview(index + 1)
              }
              onClick={() => {
                setPicked(index + 1)
                setPreview(null)
              }}
              className={cn(
                "flex flex-col gap-1 border bg-background px-3 py-2.5 text-start transition-colors duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006bff]",
                lit
                  ? "border-[#006bff]"
                  : "border-foreground/15 hover:border-foreground/40"
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-[18px] shrink-0 items-center justify-center font-mono text-[9px] text-background transition-colors duration-200",
                    lit ? "bg-[#006bff]" : "bg-foreground"
                  )}
                >
                  {index + 1}
                </span>
                <code
                  className={cn(
                    "font-mono text-[17px] leading-tight whitespace-nowrap transition-colors duration-200 @[35rem]:text-[15px] @[44rem]:text-[17px]",
                    lit && "text-[#006bff]"
                  )}
                >
                  {behavior.name}
                </code>
              </span>
              <span className="text-sm text-muted-foreground">
                {behavior.body}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { SelectBlueprint }
