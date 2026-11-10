"use client"

import type { ResizeBox } from "@ui-sdk/core"
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control"
import { cn } from "cn"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import * as React from "react"
import { Board, BoardBox, BoardHandle, useFit } from "./home-builds"
import { Numeral, Title } from "./home-posters"

const ink = "border border-foreground"
const ring =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff]"
const label = "font-mono text-[10px] tracking-[0.06em] uppercase"

const day = 100
const hour = 60
const width = day * 5
const height = hour * 8
const tick = 10
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]

type Kind = "meeting" | "focus" | "away"

const events: Record<string, { name: string; kind: Kind }> = {
  standup: { name: "Standup", kind: "meeting" },
  focus: { name: "Focus time", kind: "focus" },
  review: { name: "Review", kind: "meeting" },
  planning: { name: "Planning", kind: "meeting" },
  lunch: { name: "Lunch", kind: "meeting" },
  sam: { name: "1:1 Sam", kind: "meeting" },
  ship: { name: "Ship pricing", kind: "focus" },
  flight: { name: "Flight to Berlin", kind: "away" },
}

const start: Record<string, ResizeBox> = {
  standup: { x: 0, y: 0, width: day, height: 30 },
  focus: { x: 0, y: 60, width: day, height: 120 },
  review: { x: day, y: 120, width: day, height: 60 },
  planning: { x: day, y: 300, width: day, height: 90 },
  lunch: { x: day * 2, y: 180, width: day, height: 60 },
  sam: { x: day * 2, y: 360, width: day, height: 30 },
  ship: { x: day * 3, y: 240, width: day, height: 180 },
  flight: { x: day * 4, y: 300, width: day, height: 180 },
}

function clock(minutes: number, twelve: boolean) {
  const h = Math.floor(minutes / 60)
  const m = String(minutes % 60).padStart(2, "0")
  if (!twelve) {
    return `${h}:${m}`
  }
  return `${h % 12 || 12}${m === "00" ? "" : `:${m}`}${h < 12 ? "am" : "pm"}`
}

function minutes(pixels: number) {
  return (Math.round(pixels / tick) * tick * 60) / hour
}

function range(box: ResizeBox, twelve: boolean) {
  const from = 9 * 60 + minutes(box.y)
  return `${clock(from, twelve)}–${clock(from + minutes(box.height), twelve)}`
}

function snap(
  previous: Record<string, ResizeBox>,
  next: Record<string, ResizeBox>
) {
  const result: Record<string, ResizeBox> = {}
  for (const key of Object.keys(next)) {
    const box = next[key]
    const before = previous[key]
    let x = before.x
    if (box.x !== before.x) {
      const moved = box.x - before.x
      const columns =
        Math.abs(moved) <= 10 ? 1 : Math.round(Math.abs(moved) / day)
      x = Math.min(
        Math.max(before.x + Math.sign(moved) * columns * day, 0),
        width - day
      )
    }
    result[key] = { ...box, x, width: day }
  }
  return result
}

const Event = React.memo(function Event({
  id,
  box,
  active,
  twelve,
  small,
}: {
  id: string
  box: ResizeBox
  active: boolean
  twelve: boolean
  small: boolean
}) {
  const { name, kind } = events[id]
  const short = box.height < 60
  return (
    <BoardBox
      value={id}
      data-day={Math.round(box.x / day)}
      aria-label={`${name}, ${range(box, twelve)}, ${days[Math.round(box.x / day)]}. Arrow keys move it.`}
      className={cn(
        "group/box cursor-move p-[3px] outline-none focus-visible:z-20 data-dragging:z-20 focus-visible:[&>div]:outline-2 focus-visible:[&>div]:outline-solid focus-visible:[&>div]:outline-offset-1 focus-visible:[&>div]:outline-[#006bff]",
        active && "z-20"
      )}
    >
      <div
        className={cn(
          "relative flex h-full min-h-0 overflow-hidden px-2 transition-shadow group-data-dragging/box:shadow-[4px_4px_0_0_var(--foreground)]",
          short ? "items-center py-0" : "flex-col py-1.5",
          kind === "meeting" && "border border-foreground bg-background",
          kind === "focus" && "bg-foreground text-background",
          kind === "away" &&
            "border border-foreground bg-[repeating-linear-gradient(135deg,color-mix(in_oklab,var(--foreground)_14%,transparent)_0_1px,transparent_1px_7px)] bg-background"
        )}
      >
        <span
          className={cn(
            "leading-tight font-medium tracking-[-0.01em]",
            small ? "text-base" : "text-[13px]",
            box.height >= 90 ? "line-clamp-2 shrink-0" : "truncate"
          )}
        >
          {name}
        </span>
        {!short && !small && (
          <span
            className={cn(
              "shrink-0 font-mono text-[10px] tabular-nums",
              kind === "focus" ? "text-background/70" : "text-muted-foreground"
            )}
          >
            {range(box, twelve)}
          </span>
        )}
      </div>
      <BoardHandle
        value={`${id}:s`}
        aria-hidden="true"
        className="absolute inset-x-6 -bottom-[3px] z-10 hidden h-1.5 cursor-ns-resize border border-foreground bg-background group-focus-within/box:block group-hover/box:block group-data-dragging/box:block after:absolute after:-inset-2 pointer-coarse:after:-inset-4"
      />
    </BoardBox>
  )
})

function WeekDemo() {
  const [count, setCount] = React.useState(5)
  const [offset, setOffset] = React.useState(0)
  const [ref, scale] = useFit(count * day)
  const [boxes, setBoxes] = React.useState(start)
  const [twelve, setTwelve] = React.useState(false)
  const reveal = React.useCallback(
    (column: number) =>
      setOffset((current) =>
        Math.min(
          Math.max(current, column - count + 1),
          column,
          days.length - count
        )
      ),
    [count]
  )
  React.useEffect(() => {
    const next = scale * count * day < 360 ? 3 : 5
    if (next !== count) {
      setCount(next)
    }
    setOffset((current) => Math.min(current, days.length - next))
  }, [scale, count])
  const onBoxesChange = React.useCallback(
    (next: Record<string, ResizeBox>) =>
      setBoxes((previous) => {
        const result = snap(previous, next)
        const moved = Object.keys(result).find(
          (key) => result[key].x !== previous[key].x
        )
        if (moved) {
          reveal(result[moved].x / day)
        }
        return result
      }),
    [reveal]
  )
  const onFocus = (event: React.FocusEvent) => {
    const column = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-day]"
    )?.dataset.day
    if (column !== undefined) {
      reveal(Number(column))
    }
  }
  return (
    <>
      <Board
        boxes={boxes}
        onBoxesChange={onBoxesChange}
        defaultBoxes={start}
        width={width}
        height={height}
        scale={scale}
        step={tick}
        min={30}
        className="flex flex-col gap-8 select-none"
      >
        {({ boxes: shown, active }) => {
          const booked =
            Object.entries(shown)
              .filter(([id]) => events[id].kind !== "away")
              .reduce((sum, [, box]) => sum + minutes(box.height), 0) / 60
          return (
            <>
              <div className="flex items-baseline gap-2">
                <Numeral className="-ms-[0.06em] text-[length:clamp(2rem,6cqi,3.5rem)]">
                  {booked.toFixed(1)}
                </Numeral>
                <span className={cn(label, "text-muted-foreground")}>
                  hours booked
                </span>
              </div>
              <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2">
                <span />
                <div
                  className="grid border-b border-foreground pb-2"
                  style={{
                    gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
                  }}
                >
                  {days.slice(offset, offset + count).map((name) => (
                    <span key={name} className={cn(label, "ps-1")}>
                      {name}
                    </span>
                  ))}
                </div>
                <div aria-hidden="true" className="relative">
                  {Array.from({ length: 8 }, (_, index) => (
                    <span
                      key={index}
                      className="absolute end-0 -translate-y-1/2 font-mono text-[10px] text-muted-foreground tabular-nums"
                      style={{ top: index * hour * scale }}
                    >
                      {twelve
                        ? `${(9 + index) % 12 || 12}${9 + index < 12 ? "a" : "p"}`
                        : `${9 + index}:00`}
                    </span>
                  ))}
                </div>
                <div
                  ref={ref}
                  onFocus={onFocus}
                  className="relative w-full overflow-x-clip"
                  style={{ height: height * scale }}
                >
                  <div
                    className="absolute start-0 top-0 origin-top-left bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_12%,transparent)_1px,transparent_1px),linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_12%,transparent)_1px,transparent_1px)] rtl:origin-top-right"
                    style={{
                      width,
                      height,
                      transform: `translateX(${-offset * day * scale}px) scale(${scale})`,
                      backgroundSize: `${day}px ${hour}px`,
                    }}
                  >
                    {Object.keys(start).map((id) => (
                      <Event
                        key={id}
                        id={id}
                        box={shown[id]}
                        active={active === id}
                        twelve={twelve}
                        small={scale < 0.85}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <Title id="week" max={5} className="self-end -me-[0.04em]">
                Week.
              </Title>
            </>
          )
        }}
      </Board>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {count < days.length && (
          <div className="flex gap-1">
            {[
              { label: "Earlier days", Icon: ChevronLeftIcon, step: -1 },
              { label: "Later days", Icon: ChevronRightIcon, step: 1 },
            ].map(({ label: name, Icon, step }) => (
              <button
                key={name}
                type="button"
                aria-label={name}
                disabled={
                  offset + step < 0 || offset + step > days.length - count
                }
                onClick={() => setOffset(offset + step)}
                className={cn(
                  "relative flex size-[30px] items-center justify-center bg-background transition-colors hover:bg-foreground/[0.06] disabled:opacity-30 after:absolute after:-inset-2",
                  ink,
                  ring
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
              </button>
            ))}
          </div>
        )}
        <SegmentedControl
          aria-label="Clock"
          value={twelve ? "12h" : "24h"}
          onValueChange={(value) => setTwelve(value === "12h")}
          className={cn("relative inline-flex bg-background", ink)}
        >
          <SegmentedControlIndicator className="absolute top-(--segmented-control-indicator-top) left-(--segmented-control-indicator-left) h-(--segmented-control-indicator-height) w-(--segmented-control-indicator-width) bg-foreground transition-[left,width] duration-200" />
          {["24h", "12h"].map((value) => (
            <SegmentedControlItem
              key={value}
              value={value}
              className={cn(
                "relative h-7 px-3 font-mono text-[11px] text-muted-foreground transition-colors data-checked:text-background",
                ring
              )}
            >
              {value}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
        <div
          aria-hidden="true"
          className={cn(
            label,
            "flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground"
          )}
        >
          <span className="flex items-center gap-1.5">
            <span className={cn("size-3 bg-background", ink)} />
            Meeting
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 bg-foreground" />
            Focus
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "size-3 bg-[repeating-linear-gradient(135deg,var(--foreground)_0_1px,transparent_1px_4px)]",
                ink
              )}
            />
            Away
          </span>
        </div>
      </div>
    </>
  )
}

export { WeekDemo }
