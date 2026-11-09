"use client"

import {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
} from "@ui-sdk/react/calendar"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaCanvas,
  ColorPickerAreaThumb,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
} from "@ui-sdk/react/color-picker"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@ui-sdk/react/command"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
} from "@ui-sdk/react/number-input"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/react/accordion"
import { OTPInput, OTPInputGroup, OTPInputSeparator, OTPInputSlot } from "@ui-sdk/react/otp-input"
import { Rating, RatingItem } from "@ui-sdk/react/rating"
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/react/slider"
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"
import { Label } from "@ui-sdk/react/label"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import {
  type TokenInputValue,
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
} from "@ui-sdk/react/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuHint,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/react/trigger-menu"
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"
import { Toolbar, ToolbarSeparator } from "@ui-sdk/react/toolbar"
import { Tree, TreeGroup, TreeItem, TreeItemIndicator, TreeItemLabel } from "@ui-sdk/react/tree"
import { formatColor, parseColor } from "@ui-sdk/core/color"
import { cn } from "cn"
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CheckIcon,
  ChevronDownIcon,
  CodeIcon,
  CpuIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ItalicIcon,
  UnderlineIcon,
  FileIcon,
  FolderIcon,
  MinusIcon,
  PlusIcon,
  XIcon,
  MoveHorizontalIcon,
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

const ink = "border border-foreground"
const ring =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff] has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-2 has-focus-visible:outline-[#006bff]"
const control = cn("h-8 bg-background text-sm transition-colors", ink, ring)
const button = cn(
  control,
  "inline-flex shrink-0 cursor-default items-center justify-center gap-1.5 px-3 font-medium select-none hover:bg-foreground/[0.06] [&_svg]:size-4",
)
const icon = cn(button, "size-8 px-0")
const item =
  "flex min-h-7 cursor-default items-center gap-2 px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-foreground data-highlighted:text-background [&_svg]:size-4"
const label = "font-mono text-[11px] tracking-[0.06em] uppercase"
const description = "text-[13px] text-muted-foreground"

const cross =
  "pointer-events-none absolute size-[11px] text-[oklch(0.145_0_0)] dark:text-[oklch(0.985_0_0)] before:absolute before:inset-x-0 before:top-[5px] before:h-px before:bg-current/40 after:absolute after:inset-y-0 after:start-[5px] after:w-px after:bg-current/40"

const tones = {
  white: "[--poster:var(--background)]",
  gray: "[--poster:oklch(0.965_0_0)] dark:[--poster:oklch(0.2_0_0)]",
  ink: "[--background:oklch(0.145_0_0)] [--foreground:oklch(0.985_0_0)] [--muted-foreground:oklch(0.708_0_0)] dark:[--background:oklch(1_0_0)] dark:[--foreground:oklch(0.145_0_0)] dark:[--muted-foreground:oklch(0.54_0_0)] [--poster:var(--background)] border-transparent",
}

const line = "color-mix(in oklab, var(--foreground) 7%, transparent)"
const strong = "color-mix(in oklab, var(--foreground) 13%, transparent)"
const dot = "color-mix(in oklab, var(--foreground) 24%, transparent)"

const patterns: Record<string, React.CSSProperties> = {
  none: {},
  grid: {
    backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
    backgroundSize: "24px 24px",
    backgroundPosition: "-1px -1px",
  },
  blueprint: {
    backgroundImage: `linear-gradient(to right, ${strong} 1px, transparent 1px), linear-gradient(to bottom, ${strong} 1px, transparent 1px), linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
    backgroundSize: "96px 96px, 96px 96px, 12px 12px, 12px 12px",
    backgroundPosition: "-1px -1px",
  },
  dots: {
    backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 1.5px)`,
    backgroundSize: "14px 14px",
    backgroundPosition: "0 7px",
  },
  hatch: {
    backgroundImage: `repeating-linear-gradient(-45deg, ${line} 0 1px, transparent 1px 9px)`,
  },
  rules: {
    backgroundImage: `repeating-linear-gradient(to bottom, ${line} 0 1px, transparent 1px 12px)`,
  },
  columns: {
    backgroundImage: `repeating-linear-gradient(to right, ${line} 0 1px, transparent 1px 32px)`,
  },
  rings: {
    backgroundImage: `repeating-radial-gradient(circle at 100% 100%, ${line} 0 1px, transparent 1px 22px)`,
  },
  crosshatch: {
    backgroundImage: `repeating-linear-gradient(45deg, ${line} 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, ${line} 0 1px, transparent 1px 12px)`,
  },
  plus: {
    backgroundImage: `linear-gradient(to right, transparent 9px, ${strong} 9px 10px, transparent 10px), linear-gradient(to bottom, transparent 9px, ${strong} 9px 10px, transparent 10px)`,
    backgroundSize: "40px 40px, 40px 40px",
  },
  ruler: {
    backgroundImage: `repeating-linear-gradient(to right, ${strong} 0 1px, transparent 1px 48px), repeating-linear-gradient(to right, ${line} 0 1px, transparent 1px 8px)`,
    backgroundSize: "100% 100%, 100% 14px",
    backgroundRepeat: "no-repeat, repeat-x",
  },
  squares: {
    backgroundColor: strong,
    WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200' fill='none' stroke='black'>${Array.from(
        { length: 30 },
        (_, index) =>
          `<rect x='${600 - (index + 1) * 20}.5' y='${600 - (index + 1) * 20}.5' width='${(index + 1) * 40}' height='${(index + 1) * 40}'/>`,
      ).join("")}</svg>`,
    )}")`,
    WebkitMaskPosition: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "1200px 1200px",
  },
  isometric: {
    backgroundImage: `repeating-linear-gradient(30deg, ${line} 0 1px, transparent 1px 16px), repeating-linear-gradient(150deg, ${line} 0 1px, transparent 1px 16px), repeating-linear-gradient(90deg, ${line} 0 1px, transparent 1px 27.7px)`,
  },
  halftone: {
    backgroundImage: `radial-gradient(circle, ${dot} 1.4px, transparent 1.6px)`,
    backgroundSize: "10px 10px",
    WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
  },
}

function Poster({
  fig,
  title,
  meta,
  head,
  touch,
  tone = "gray",
  pattern = "grid",
  backdrop,
  body = "justify-center",
  className,
  children,
}: {
  fig?: string
  title?: React.ReactNode
  meta?: { label: string; href?: string }[]
  head?: React.ReactNode
  touch?: React.ReactNode
  tone?: keyof typeof tones
  pattern?: keyof typeof patterns
  backdrop?: React.ReactNode
  body?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={typeof title === "string" ? slug(title) : undefined}
      className={cn(
        "@container relative scroll-mt-24 flex min-w-0 flex-col gap-10 border-(length:--poster-border) [--poster-border:1px] lg:min-h-[36rem] text-foreground border-foreground/10 bg-(--poster) p-6 sm:p-8 lg:p-10",
        tones[tone],
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={patterns[pattern]} />
        {backdrop}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute -inset-(--poster-border)">
        <span className={cn(cross, "-start-[5px] -top-[5px]")} />
        <span className={cn(cross, "-end-[5px] -top-[5px]")} />
        <span className={cn(cross, "-start-[5px] -bottom-[5px]")} />
        <span className={cn(cross, "-end-[5px] -bottom-[5px]")} />
      </div>
      <div className="relative flex items-start justify-between gap-6 font-mono text-[11px] leading-4 tracking-[0.06em] text-foreground uppercase">
        <div className="min-w-0 whitespace-pre-line">
          {touch ? (
            <>
              <span className="pointer-coarse:hidden">{head}</span>
              <span className="hidden pointer-coarse:inline">{touch}</span>
            </>
          ) : (
            head
          )}
        </div>
        {fig && <div className="hidden shrink-0 text-muted-foreground @[26rem]:block">{fig}</div>}
      </div>
      <div className={cn("relative flex min-w-0 flex-1 flex-col", body)}>{children}</div>
      {(title || meta) && (
        <div className="relative flex flex-col gap-4">
          {title && (
            <h2 className="text-[clamp(1.5rem,10cqi,3rem)] font-[450] tracking-[-0.045em] whitespace-nowrap">
              {title}
            </h2>
          )}
          {meta && (
            <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
              {meta.map((entry) =>
                entry.href ? (
                  <Link
                    key={entry.label}
                    href={entry.href}
                    className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {entry.label}
                  </Link>
                ) : (
                  <span key={entry.label}>{entry.label}</span>
                ),
              )}
            </p>
          )}
        </div>
      )}
    </section>
  )
}

function slug(text: string) {
  return text.replace(/\.$/, "").toLowerCase().replace(/\W+/g, "-")
}

function Title({
  id,
  children,
  max = 30,
  vertical = false,
  className,
}: {
  id?: string
  children: string
  max?: number
  vertical?: boolean
  className?: string
}) {
  const fit = 100 / (children.length * 0.56)
  return (
    <h2
      id={id}
      className={cn(
        "scroll-mt-24 font-[450] leading-[0.82] tracking-[-0.05em] whitespace-nowrap",
        vertical && "@[20rem]:[writing-mode:vertical-rl]",
        className,
      )}
      style={{ fontSize: `max(min(2.25rem, ${fit.toFixed(2)}cqi), min(${max}cqi, ${fit.toFixed(2)}cqi))` }}
    >
      {children}
    </h2>
  )
}

function Numeral({
  children,
  outline = false,
  className,
}: {
  children: React.ReactNode
  outline?: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none block font-[450] leading-[0.74] tracking-[-0.04em] select-none",
        outline
          ? "text-(--poster) [-webkit-text-stroke:2px_var(--foreground)] [paint-order:stroke_fill]"
          : "tabular-nums",
        className,
      )}
    >
      {children}
    </span>
  )
}

function Pill({ name, href, className }: { name: string; href?: string; className?: string }) {
  return (
    <Link
      data-round=""
      href={href ?? `/docs/react/components/${name}`}
      className={cn(
        "relative inline-flex h-7 w-fit max-w-full shrink-0 items-center gap-2 rounded-full whitespace-nowrap border border-foreground bg-(--poster) px-3 font-mono text-[11px] tracking-[0.02em] transition-colors outline-none after:absolute after:-inset-2 hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff]",
        className,
      )}
    >
      {href ? name : `@ui-sdk/react/${name}`}
      <span aria-hidden="true">↗</span>
    </Link>
  )
}

const tick = "absolute size-2 border-foreground/50"

function Measure({
  full = false,
  className,
  children,
}: {
  full?: boolean
  className?: string
  children: React.ReactNode
}) {
  const box = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null)
  React.useEffect(() => {
    const element = box.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      const border = entry.borderBoxSize[0]
      setSize({ width: Math.round(border.inlineSize), height: Math.round(border.blockSize) })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return (
    <div className={cn("relative ps-7 pt-7", full ? "w-full" : "w-fit max-w-full", className)}>
      <div aria-hidden="true" className="absolute start-7 end-0 top-0 flex h-3 items-center">
        <span className="absolute inset-y-0 start-0 w-px bg-foreground/40" />
        <span className="h-px flex-1 bg-foreground/40" />
        <span className="bg-(--poster) px-1.5 font-mono text-[10px] text-muted-foreground tabular-nums">
          {size?.width ?? ""}
        </span>
        <span className="h-px flex-1 bg-foreground/40" />
        <span className="absolute inset-y-0 end-0 w-px bg-foreground/40" />
      </div>
      <div aria-hidden="true" className="absolute start-0 top-7 bottom-0 flex w-3 flex-col items-center">
        <span className="absolute inset-x-0 top-0 h-px bg-foreground/40" />
        <span className="w-px flex-1 bg-foreground/40" />
        <span className="rotate-180 bg-(--poster) py-1.5 font-mono text-[10px] text-muted-foreground tabular-nums [writing-mode:vertical-rl]">
          {size?.height ?? ""}
        </span>
        <span className="w-px flex-1 bg-foreground/40" />
        <span className="absolute inset-x-0 bottom-0 h-px bg-foreground/40" />
      </div>
      <div ref={box} className="relative">
        <span aria-hidden="true" className={cn(tick, "-start-2 -top-2 border-e border-b")} />
        <span aria-hidden="true" className={cn(tick, "-end-2 -top-2 border-s border-b")} />
        <span aria-hidden="true" className={cn(tick, "-start-2 -bottom-2 border-e border-t")} />
        <span aria-hidden="true" className={cn(tick, "-end-2 -bottom-2 border-s border-t")} />
        {children}
      </div>
    </div>
  )
}

function ComponentPoster({
  title,
  id,
  name,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Poster>, "title" | "body" | "backdrop"> & {
  title: string
  id: string
  name: string
}) {
  return (
    <Poster {...props} body="gap-8 sm:gap-10">
      <div className="flex flex-1 items-center justify-center">{children}</div>
      <div className="flex flex-col gap-5">
        <Title id={id} max={13} className="-ms-[0.04em]">
          {title}
        </Title>
        <Keys keys={keyboard[name] ?? []} />
      </div>
    </Poster>
  )
}

const keyboard: Record<string, string[]> = {
  calendar: ["←", "→", "↑", "↓", "PgUp", "PgDn"],
  command: ["↑", "↓", "Enter", "Esc"],
  "otp-input": ["←", "→", "Backspace"],
  rating: ["←", "→"],
  "number-input": ["↑", "↓", "Home", "End"],
  switch: ["Space"],
  slider: ["←", "→", "Home", "End"],
  "segmented-control": ["←", "→"],
  "color-picker": ["←", "→", "↑", "↓"],
  tree: ["↑", "↓", "←", "→", "Enter"],
  tabs: ["←", "→", "Home", "End"],
  "token-input": ["@", "/", "Tab", "Backspace"],
  accordion: ["Enter", "Space"],
  resizable: ["←", "→", "Home", "End"],
  toolbar: ["←", "→", "Home", "End"],
}

function Keys({ keys }: { keys: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 pointer-coarse:hidden">
      {keys.map((key) => (
        <kbd
          key={key}
          className="inline-flex h-7 min-w-7 items-center justify-center border border-foreground bg-(--poster) px-2 font-mono text-[11px]"
        >
          {key}
        </kbd>
      ))}
    </div>
  )
}

function number(fig?: string) {
  return fig?.replace(/\D/g, "") ?? ""
}

function iso(date: Date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join("-")
}

function CalendarTile({ className, fig }: { className?: string; fig?: string }) {
  const [range] = React.useState(() => {
    const start = new Date()
    start.setDate(start.getDate() + 3)
    const end = new Date(start)
    end.setDate(end.getDate() + 4)
    return [iso(start), iso(end)] as [string, string]
  })
  return (
    <ComponentPoster
      fig={fig}
      head={"PICK YOUR DATES\nDRAG ACROSS THEM\nOR USE THE ARROWS"}
      touch={"PICK YOUR DATES\nTAP A START, THEN AN END"}
      tone="white"
      pattern="plus"
      title="Calendar."
      id="calendar"
      name="calendar"
      className={className}
    >
      <Measure>
        <Calendar mode="range" fixedWeeks defaultValue={range} className={cn("bg-background p-3", ink)}>
          <div className="mb-3 flex items-center justify-between">
            <CalendarPrevious className={icon}>
              <ChevronLeftIcon aria-hidden="true" />
            </CalendarPrevious>
            <CalendarHeading className={label} />
            <CalendarNext className={icon}>
              <ChevronRightIcon aria-hidden="true" />
            </CalendarNext>
          </div>
          <CalendarGrid className="border-collapse">
            <CalendarWeekdays>
              {(index) => (
                <CalendarWeekday
                  index={index}
                  className="pb-2 font-mono text-[10px] font-normal text-muted-foreground uppercase"
                />
              )}
            </CalendarWeekdays>
            <CalendarWeeks>
              {(cell) => (
                <CalendarDay
                  value={cell.date}
                  className={cn(
                    "size-9 text-center text-sm tabular-nums transition-colors @[22rem]:size-11 @[22rem]:text-base @[30rem]:size-13 @[30rem]:text-lg hover:bg-foreground/[0.06] data-outside:text-muted-foreground/50 data-today:underline data-today:underline-offset-4",
                    "data-range-middle:bg-foreground/[0.08]",
                    "[&[data-selected]:not([data-range-middle])]:bg-foreground [&[data-selected]:not([data-range-middle])]:text-background",
                    ring,
                  )}
                />
              )}
            </CalendarWeeks>
          </CalendarGrid>
        </Calendar>
      </Measure>
    </ComponentPoster>
  )
}

const commands = [
  { group: "Pages", value: "dashboard", label: "Dashboard" },
  { group: "Pages", value: "projects", label: "Projects" },
  { group: "Pages", value: "calendar", label: "Calendar" },
  { group: "Account", value: "profile", label: "Profile", shortcut: "mod+p" },
  { group: "Account", value: "billing", label: "Billing", shortcut: "mod+b" },
  { group: "Account", value: "settings", label: "Settings", shortcut: "mod+s" },
]

function CommandTile({ className, fig }: { className?: string; fig?: string }) {
  return (
    <ComponentPoster
      fig={fig}
      head={"SEARCH EVERYTHING\nTYPE, THEN PRESS ENTER"}
      touch={"SEARCH EVERYTHING\nTYPE, THEN TAP A RESULT"}
      pattern="halftone"
      title="Command."
      id="command"
      name="command"
      className={className}
    >
      <Measure full>
        <Command className={cn("flex h-[25.5rem] flex-col bg-background", ink)}>
          <div className="flex items-center gap-3 border-b border-foreground px-4 has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:-outline-offset-2 has-focus-visible:outline-[#006bff]">
            <span aria-hidden="true" className="font-mono text-sm text-muted-foreground">
              &gt;
            </span>
            <CommandInput
              aria-label="Search commands"
              placeholder="Go to..."
              className="h-14 w-full min-w-0 bg-transparent text-lg tracking-[-0.01em] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <CommandEmpty className="flex flex-1 items-center justify-center font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase empty:hidden">
            Nothing found
          </CommandEmpty>
          <CommandList className="min-h-0 flex-1 overflow-y-auto py-1">
            {["Pages", "Account"].map((group) => (
              <CommandGroup key={group}>
                <CommandGroupLabel className={cn(label, "px-4 pt-3 pb-1.5 text-muted-foreground")}>
                  {group}
                </CommandGroupLabel>
                {commands
                  .filter((command) => command.group === group)
                  .map((command) => (
                    <CommandItem
                      key={command.value}
                      value={command.value}
                      shortcut={command.shortcut}
                      className="flex h-9 cursor-default items-center justify-between gap-3 px-4 text-[15px] outline-none select-none data-highlighted:bg-foreground data-highlighted:text-background"
                    >
                      {command.label}
                      <CommandShortcut className="border border-current/30 px-1.5 font-mono text-[11px] leading-5 tracking-widest empty:hidden" />
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
          <div
            aria-hidden="true"
            className="flex h-9 items-center gap-4 border-t border-foreground px-4 font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase"
          >
            <span>↑↓ Move</span>
            <span>↵ Open</span>
            <span className="ms-auto">{commands.length} commands</span>
          </div>
        </Command>
      </Measure>
    </ComponentPoster>
  )
}

const slot = cn(
  "relative -ms-px flex h-16 min-w-0 flex-1 items-center justify-center bg-background text-3xl tabular-nums @[24rem]:h-24 @[24rem]:text-5xl first:ms-0 data-active:z-10 data-active:outline-2 data-active:outline-offset-0 data-active:outline-[#006bff]",
  ink,
  "[&[data-fake-caret]:empty]:after:h-4 [&[data-fake-caret]:empty]:after:w-px [&[data-fake-caret]:empty]:after:animate-caret-blink [&[data-fake-caret]:empty]:after:bg-foreground [&[data-fake-caret]:empty]:after:content-['']",
)

function OTPTile({ className, fig }: { className?: string; fig?: string }) {
  return (
    <ComponentPoster
      fig={fig}
      head={"ENTER THE CODE WE SENT\nPASTING IT WORKS TOO"}
      pattern="rules"
      title="OTP Input."
      id="otp-input"
      name="otp-input"
      className={className}
    >
      <Measure full>
        <OTPInput
          maxLength={6}
          defaultValue="482"
          aria-label="Verification code"
          className="flex w-full items-center gap-2"
        >
          <OTPInputGroup className="flex flex-1">
            {[0, 1, 2].map((index) => (
              <OTPInputSlot key={index} index={index} className={slot} />
            ))}
          </OTPInputGroup>
          <OTPInputSeparator className="text-muted-foreground">
            <MinusIcon aria-hidden="true" className="size-4" />
          </OTPInputSeparator>
          <OTPInputGroup className="flex flex-1">
            {[3, 4, 5].map((index) => (
              <OTPInputSlot key={index} index={index} className={slot} />
            ))}
          </OTPInputGroup>
        </OTPInput>
      </Measure>
    </ComponentPoster>
  )
}

const step =
  "flex size-20 shrink-0 items-center justify-center @[24rem]:size-24 hover:bg-foreground/[0.06] disabled:text-muted-foreground/50 [&_svg]:size-6"

function Star() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[15cqi] fill-current">
      <polygon points="12 1.4 14.58 9.35 22.94 9.35 16.18 14.26 18.76 22.2 12 17.29 5.24 22.2 7.82 14.26 1.06 9.35 9.42 9.35" />
    </svg>
  )
}

function RatingTile({ className, fig }: { className?: string; fig?: string }) {
  const [value, setValue] = React.useState<number | null>(4)
  return (
    <ComponentPoster
      fig={fig}
      head={"RATE IT\nHOVER TO PREVIEW A SCORE"}
      touch={"RATE IT\nTAP A STAR"}
      tone="white"
      pattern="dots"
      title="Rating."
      id="rating"
      name="rating"
      className={className}
    >
      <Measure>
        <Rating
          aria-label="Your stay"
          value={value}
          onValueChange={setValue}
          className="flex justify-between"
        >
          <RatingItem className="group/star relative inline-flex cursor-default text-foreground/15 has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-2 has-focus-visible:outline-[#006bff]">
            <Star />
            <span className="absolute inset-y-0 start-0 w-[calc(var(--rating-fill)*100%)] overflow-hidden text-foreground group-data-highlighted/star:text-foreground/50">
              <Star />
            </span>
          </RatingItem>
        </Rating>
      </Measure>
    </ComponentPoster>
  )
}

function NumberInputTile({ className, fig }: { className?: string; fig?: string }) {
  return (
    <ComponentPoster
      fig={fig}
      head={"PICK A NUMBER\nTYPE IT, CLICK, OR USE\nTHE ARROWS"}
      touch={"PICK A NUMBER\nTYPE IT, TAP, OR DRAG\nTHE RULER"}
      pattern="halftone"
      title="Number Input."
      id="number-input"
      name="number-input"
      className={className}
    >
      <Measure full>
        <NumberInput defaultValue={2} min={1} max={100}>
          <NumberInputScrubArea
            pixelsPerStep={16}
            className="mb-3 flex cursor-ew-resize flex-col gap-1.5 font-mono text-[10px] text-muted-foreground select-none hover:text-foreground"
          >
            <span className="flex items-center justify-between tracking-[0.06em] uppercase">
              Guests
              <span>Drag to scrub ↔</span>
            </span>
            <span aria-hidden="true" className="flex h-2.5 items-end justify-between">
              {Array.from({ length: 29 }, (_, index) => (
                <span key={index} className={cn("w-px bg-current", index % 4 === 0 ? "h-full" : "h-1.5")} />
              ))}
            </span>
            <NumberInputScrubAreaCursor className="text-foreground">
              <MoveHorizontalIcon aria-hidden="true" className="size-4" />
            </NumberInputScrubAreaCursor>
          </NumberInputScrubArea>
          <NumberInputGroup
            className={cn(
              "flex h-20 w-full items-center bg-background @[24rem]:h-24",
              ink,
              "has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-2 has-focus-visible:outline-[#006bff]",
            )}
          >
            <NumberInputDecrement
              aria-label="Fewer guests"
              className={cn(step, "border-e border-foreground")}
            >
              <MinusIcon aria-hidden="true" />
            </NumberInputDecrement>
            <NumberInputControl
              aria-label="Guests"
              className="w-full min-w-0 flex-1 bg-transparent text-center text-5xl tracking-tight tabular-nums outline-none @[24rem]:text-[4rem]"
            />
            <NumberInputIncrement aria-label="More guests" className={cn(step, "border-s border-foreground")}>
              <PlusIcon aria-hidden="true" />
            </NumberInputIncrement>
          </NumberInputGroup>
        </NumberInput>
      </Measure>
    </ComponentPoster>
  )
}

const switches = [
  { title: "Weekly digest", body: "A summary of your week, every Monday.", on: true },
  { title: "Mentions", body: "Only when someone mentions you.", on: false },
  { title: "Product news", body: "New features, a few times a year.", on: true },
]

function SwitchTile({ className, fig }: { className?: string; fig?: string }) {
  return (
    <ComponentPoster
      fig={fig}
      head={"TURN THINGS ON AND OFF\nCLICK OR PRESS SPACE"}
      touch={"TURN THINGS ON AND OFF\nTAP A SWITCH"}
      tone="white"
      pattern="hatch"
      title="Switch."
      id="switch"
      name="switch"
      className={className}
    >
      <Measure full>
        <div className={cn("flex flex-col divide-y divide-foreground/15 bg-background", ink)}>
          {switches.map((setting) => (
            <div key={setting.title} className="flex items-center justify-between gap-4 p-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor={`setting-${slug(setting.title)}`} className={cn(label, "cursor-default")}>
                  {setting.title}
                </Label>
                <span id={`setting-${slug(setting.title)}-description`} className={description}>
                  {setting.body}
                </span>
              </div>
              <Switch
                id={`setting-${slug(setting.title)}`}
                aria-describedby={`setting-${slug(setting.title)}-description`}
                defaultChecked={setting.on}
                className={cn(
                  "group/switch inline-flex h-5 w-9 shrink-0 items-center bg-background p-[3px] transition-colors data-checked:bg-foreground",
                  ink,
                  ring,
                )}
              >
                <SwitchThumb className="size-3 bg-foreground transition-transform group-data-checked/switch:translate-x-4 group-data-checked/switch:bg-background rtl:group-data-checked/switch:-translate-x-4" />
              </Switch>
            </div>
          ))}
        </div>
      </Measure>
    </ComponentPoster>
  )
}

function SliderTile({ className, fig }: { className?: string; fig?: string }) {
  return (
    <ComponentPoster
      fig={fig}
      head={"SET THE VOLUME\nDRAG, CLICK OR USE\nTHE ARROWS"}
      touch={"SET THE VOLUME\nDRAG OR TAP THE TRACK"}
      tone="white"
      pattern="columns"
      title="Slider."
      id="slider"
      name="slider"
      className={className}
    >
      <Measure full>
        <Slider defaultValue={60} className={cn("flex flex-col gap-4 bg-background p-4", ink)}>
          <div className="flex items-center justify-between">
            <span aria-hidden="true" className={label}>
              Volume
            </span>
            <SliderValue className="font-mono text-[11px] text-muted-foreground tabular-nums" />
          </div>
          <SliderControl className="flex h-6 items-center">
            <SliderTrack className="relative h-px w-full bg-foreground/25">
              <SliderIndicator className="h-0.5 -translate-y-[0.5px] bg-foreground" />
              <SliderThumb
                aria-label="Volume"
                className={cn("size-4 bg-background data-dragging:bg-foreground", ink, ring)}
              />
            </SliderTrack>
          </SliderControl>
          <div
            aria-hidden="true"
            className="flex justify-between font-mono text-[10px] text-muted-foreground"
          >
            {[0, 25, 50, 75, 100].map((mark) => (
              <span
                key={mark}
                className="flex w-0 flex-col items-center gap-1 first:items-start last:items-end"
              >
                <span className="h-1.5 w-px bg-foreground/30" />
                {mark}
              </span>
            ))}
          </div>
        </Slider>
      </Measure>
    </ComponentPoster>
  )
}

function SegmentedTile({ className, fig }: { className?: string; fig?: string }) {
  return (
    <ComponentPoster
      fig={fig}
      head={"PICK ONE OPTION\nOR USE THE ARROWS"}
      touch={"PICK ONE OPTION\nTAP TO SWITCH"}
      tone="white"
      pattern="rings"
      title="Segmented Control."
      id="segmented-control"
      name="segmented-control"
      className={className}
    >
      <Measure full>
        <SegmentedControl
          aria-label="View"
          defaultValue="list"
          className={cn("relative flex w-full bg-background", ink)}
        >
          <SegmentedControlIndicator className="absolute top-(--segmented-control-indicator-top) left-(--segmented-control-indicator-left) h-(--segmented-control-indicator-height) w-(--segmented-control-indicator-width) bg-foreground transition-[left,width] duration-200" />
          {["List", "Grid", "Board"].map((view) => (
            <SegmentedControlItem
              key={view}
              value={view.toLowerCase()}
              className={cn(
                "relative h-16 min-w-0 flex-1 px-2 text-lg font-medium @[22rem]:px-4 @[22rem]:text-xl @[24rem]:h-20 @[24rem]:text-2xl text-muted-foreground transition-colors data-checked:text-background",
                ring,
              )}
            >
              {view}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </Measure>
    </ComponentPoster>
  )
}

const presets = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#0ea5e9", "#6366f1", "#a855f7", "#ec4899"]
const thumb = cn(
  "absolute size-3.5 border-2 border-white bg-(--color-picker-color) shadow-[0_0_0_1px_rgb(0_0_0/0.5)]",
  ring,
)

const formats = [
  { value: "hex", label: "HEX" },
  { value: "srgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "oklch", label: "OKLCH" },
] as const

function ColorTile({ className, fig }: { className?: string; fig?: string }) {
  const [format, setFormat] = React.useState<(typeof formats)[number]["value"]>("hex")
  const [value, setValue] = React.useState("#6366f1")
  return (
    <ComponentPoster
      fig={fig}
      head={"PICK A COLOR\nDRAG, OR TYPE A VALUE"}
      pattern="squares"
      title="Color Picker."
      id="color-picker"
      name="color-picker"
      className={className}
    >
      <Measure>
        <ColorPicker
          aria-label="Brand color"
          value={value}
          onValueChange={setValue}
          format={format}
          className={cn(
            "flex w-64 max-w-full flex-col gap-3 bg-background p-3 @[20rem]:w-80 [&_[data-slot=color-picker-area-canvas]]:grayscale [&_[data-slot=color-picker-area-thumb]]:grayscale [&_[data-slot=color-picker-slider]]:grayscale [&_[data-slot=color-picker-swatch-item]]:grayscale [&_[data-slot=color-picker-swatch]]:grayscale",
            ink,
          )}
        >
          <ColorPickerArea className="relative h-32 cursor-crosshair border border-foreground @[20rem]:h-44">
            <ColorPickerAreaCanvas className="absolute inset-0 size-full" />
            <ColorPickerAreaThumb className={cn(thumb, "-translate-1/2")} />
          </ColorPickerArea>
          <div className="flex items-center gap-3">
            <ColorPickerSlider
              channel="hue"
              className="relative h-3 flex-1 border border-foreground [background:var(--color-slider-background)]"
            >
              <ColorPickerSliderThumb
                className={cn(
                  thumb,
                  "top-1/2 translate-x-[calc(var(--color-slider-thumb-position)*-1)] -translate-y-1/2",
                )}
              />
            </ColorPickerSlider>
            <ColorPickerSwatch className="size-7 shrink-0 border border-foreground bg-(--color-picker-color)" />
          </div>
          <SegmentedControl
            aria-label="Format"
            value={format}
            onValueChange={(next) => {
              const color = parseColor(value)
              setFormat(next as typeof format)
              if (color) setValue(formatColor(color, next as typeof format))
            }}
            className={cn("relative flex w-full bg-background", ink)}
          >
            <SegmentedControlIndicator className="absolute top-(--segmented-control-indicator-top) left-(--segmented-control-indicator-left) h-(--segmented-control-indicator-height) w-(--segmented-control-indicator-width) bg-foreground transition-[left,width] duration-200" />
            {formats.map((entry) => (
              <SegmentedControlItem
                key={entry.value}
                value={entry.value}
                className={cn(
                  "relative h-8 flex-1 font-mono text-[11px] tracking-[0.06em] text-muted-foreground transition-colors data-checked:text-background",
                  ring,
                )}
              >
                {entry.label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
          <div className="flex gap-2">
            <ColorPickerInput
              aria-label="Color"
              className={cn(control, "min-w-0 flex-1 px-2.5 font-mono text-[12px] pointer-coarse:text-base")}
            />
          </div>
          <ColorPickerSwatches aria-label="Presets" className="grid grid-cols-8 gap-1.5">
            {presets.map((preset) => (
              <ColorPickerSwatchItem
                key={preset}
                value={preset}
                className="aspect-square bg-(--color-picker-color) outline-offset-2 data-selected:outline-2 data-selected:outline-foreground data-selected:focus-visible:outline-[#006bff] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-[#006bff]"
              />
            ))}
          </ColorPickerSwatches>
        </ColorPicker>
      </Measure>
    </ComponentPoster>
  )
}

type Node = { value: string; label: string; children?: Node[] }

const files: Node[] = [
  {
    value: "app",
    label: "app",
    children: [
      { value: "app/layout.tsx", label: "layout.tsx" },
      { value: "app/page.tsx", label: "page.tsx" },
    ],
  },
  {
    value: "components",
    label: "components",
    children: [
      { value: "components/calendar.tsx", label: "calendar.tsx" },
      { value: "components/command.tsx", label: "command.tsx" },
    ],
  },
  { value: "package.json", label: "package.json" },
  { value: "README.md", label: "README.md" },
]

function Files({ items }: { items: Node[] }) {
  return items.map((node) => (
    <TreeItem key={node.value} value={node.value} className="group/item outline-none">
      <TreeItemLabel className="flex h-9 items-center gap-2 ps-[calc(0.5rem+(var(--tree-level,1)-1)*1rem)] pe-3 text-[15px] whitespace-nowrap select-none [:focus-visible>&]:outline-2 [:focus-visible>&]:outline-solid [:focus-visible>&]:-outline-offset-2 [:focus-visible>&]:outline-[#006bff] hover:bg-foreground/[0.06] data-selected:bg-foreground data-selected:text-background [&>svg]:size-4 [&>svg]:shrink-0">
        {node.children ? (
          <TreeItemIndicator className="flex size-4 items-center justify-center transition-transform data-expanded:rotate-90 rtl:-scale-x-100">
            <ChevronRightIcon aria-hidden="true" className="size-3.5" />
          </TreeItemIndicator>
        ) : (
          <span className="size-4" />
        )}
        {node.children ? <FolderIcon aria-hidden="true" /> : <FileIcon aria-hidden="true" />}
        <span>{node.label}</span>
      </TreeItemLabel>
      {node.children && (
        <TreeGroup>
          <Files items={node.children} />
        </TreeGroup>
      )}
    </TreeItem>
  ))
}

function TreeTile({ className, fig }: { className?: string; fig?: string }) {
  return (
    <ComponentPoster
      fig={fig}
      head={"OPEN A FOLDER\nRIGHT ARROW OPENS\nLEFT ARROW CLOSES"}
      touch={"OPEN A FOLDER\nTAP TO OPEN OR CLOSE IT"}
      pattern="isometric"
      title="Tree."
      id="tree"
      name="tree"
      className={className}
    >
      <Measure full>
        <Tree
          aria-label="Files"
          defaultExpanded={["app", "components"]}
          defaultValue="app/page.tsx"
          className={cn("flex min-w-max flex-col bg-background p-1", ink)}
        >
          <Files items={files} />
        </Tree>
      </Measure>
    </ComponentPoster>
  )
}

const periods = [
  { value: "week", label: "Week", total: "12.4k", change: "+8%", bars: [32, 48, 40, 64, 52, 76, 94] },
  {
    value: "month",
    label: "Month",
    total: "51.9k",
    change: "+12%",
    bars: [40, 36, 52, 48, 60, 56, 72, 64, 70, 82, 76, 88],
  },
  {
    value: "year",
    label: "Year",
    total: "604k",
    change: "+31%",
    bars: [20, 28, 26, 38, 44, 40, 52, 58, 64, 70, 80, 92],
  },
]
const tab = cn(
  "h-11 min-w-0 flex-1 px-2 text-sm font-medium text-muted-foreground @[22rem]:px-3 transition-colors select-none hover:text-foreground data-selected:bg-foreground data-selected:text-background",
  ring,
)

function TabsTile({ className, fig }: { className?: string; fig?: string }) {
  return (
    <ComponentPoster
      fig={fig}
      head={"SWITCH TABS\nCLICK OR USE THE ARROWS"}
      touch={"SWITCH TABS\nTAP ONE TO OPEN IT"}
      pattern="ruler"
      title="Tabs."
      id="tabs"
      name="tabs"
      className={className}
    >
      <Measure full>
        <Tabs defaultValue="week" className={cn("flex flex-col bg-background", ink)}>
          <div className="border-b border-foreground p-3">
            <TabsList className={cn("flex divide-x divide-foreground", ink)}>
              {periods.map((period) => (
                <TabsTab key={period.value} value={period.value} className={tab}>
                  {period.label}
                </TabsTab>
              ))}
            </TabsList>
          </div>
          {periods.map((period) => (
            <TabsPanel
              key={period.value}
              value={period.value}
              className="flex flex-col gap-4 p-4 outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[#006bff]"
            >
              <div>
                <p className={cn(label, "text-muted-foreground")}>Visitors</p>
                <p className="mt-1 flex items-baseline gap-2 text-3xl font-medium tracking-tight tabular-nums">
                  {period.total}
                  <span className="font-mono text-[11px] font-normal tracking-normal text-muted-foreground">
                    {period.change}
                  </span>
                </p>
              </div>
              <div aria-hidden="true" className="flex h-40 items-end gap-1.5 @[28rem]:h-52">
                {period.bars.map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 border border-foreground bg-background transition-colors last:bg-foreground hover:bg-foreground/20"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </TabsPanel>
          ))}
        </Tabs>
      </Measure>
    </ComponentPoster>
  )
}

const mentions = [
  { value: "app/page.tsx", label: "page.tsx", keywords: ["app"] },
  { value: "app/layout.tsx", label: "layout.tsx", keywords: ["app"] },
  { value: "components/calendar.tsx", label: "calendar.tsx", keywords: ["components"] },
  { value: "README.md", label: "README.md" },
  { value: "package.json", label: "package.json" },
]

const skills = [
  {
    value: "model",
    label: "model",
    arguments: [
      {
        name: "model",
        hint: "<model>",
        required: true,
        items: ["opus", "sonnet", "haiku"],
        allowCustomValue: false,
      },
      {
        name: "effort",
        hint: "<effort>",
        required: true,
        items: ["low", "medium", "high"],
        allowCustomValue: false,
      },
    ],
  },
  { value: "review", label: "review" },
  { value: "test", label: "test" },
  { value: "explain", label: "explain" },
]

const token =
  "inline-flex items-center gap-1 border border-foreground px-1 font-mono text-[15px] data-selected:bg-foreground data-selected:text-background [&_svg]:size-3.5"

function TokenInputTile({ className, fig }: { className?: string; fig?: string }) {
  return (
    <ComponentPoster
      fig={fig}
      head={"WRITE A PROMPT\nADD FILES, SKILLS, A MODEL"}
      tone="white"
      pattern="crosshatch"
      title="Token Input."
      id="token-input"
      name="token-input"
      className={className}
    >
      <Measure full>
        <TokenInput
          renderToken={(entry) => {
            return (
              <TokenInputToken className={token}>
                {entry.type === "skill" ? (
                  entry.value === "model" ? (
                    <CpuIcon aria-hidden="true" />
                  ) : (
                    <CodeIcon aria-hidden="true" />
                  )
                ) : (
                  <FileIcon aria-hidden="true" />
                )}
                {entry.type === "skill" ? `/${entry.label}` : entry.label}
                <TokenInputTokenRemove className="inline-flex text-muted-foreground hover:text-foreground">
                  <XIcon aria-hidden="true" className="size-3" />
                </TokenInputTokenRemove>
              </TokenInputToken>
            )
          }}
        >
          <TokenInputEditor
            aria-label="Prompt"
            placeholder="Type @ to pick a file, or / for a skill or model"
            className={cn(
              "relative min-h-40 bg-background p-5 text-xl leading-10 outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff] data-empty:before:pointer-events-none data-empty:before:absolute data-empty:before:text-muted-foreground data-empty:before:content-[attr(aria-placeholder)]",
              ink,
            )}
          />
          <TriggerMenu
            triggers={[
              { char: "@", type: "file", items: mentions },
              { char: "/", type: "skill", items: skills },
            ]}
          >
            <TriggerMenuHint className="text-muted-foreground" />
            <TriggerMenuContent className="max-h-(--available-height) min-w-56 overflow-y-auto bg-background p-1 ring-1 ring-foreground outline-none">
              <TriggerMenuEmpty className={cn(label, "px-2 py-3 text-muted-foreground empty:hidden")}>
                No matches
              </TriggerMenuEmpty>
              <TriggerMenuList>
                {(state) =>
                  (state.items as (TriggerMenuDataItem | string)[]).map((entry) => {
                    const option = typeof entry === "string" ? { value: entry, label: entry } : entry
                    return (
                      <TriggerMenuItem
                        key={option.value}
                        value={option.value}
                        label={option.label}
                        className={cn(item, "font-mono text-[13px]")}
                      >
                        {option.label}
                      </TriggerMenuItem>
                    )
                  })
                }
              </TriggerMenuList>
            </TriggerMenuContent>
          </TriggerMenu>
        </TokenInput>
      </Measure>
    </ComponentPoster>
  )
}

const faq = [
  {
    value: "shipping",
    label: "When will my order ship?",
    body: "Most orders leave within a day. Express takes two to three days.",
  },
  {
    value: "returns",
    label: "Can I send it back?",
    body: "Yes. Send back anything unused within 30 days for a full refund.",
  },
  {
    value: "support",
    label: "How do I reach you?",
    body: "Write to us by email or chat. We answer within a day.",
  },
]

function AccordionTile({ className, fig }: { className?: string; fig?: string }) {
  return (
    <ComponentPoster
      fig={fig}
      head={"ONE SECTION OPEN AT A TIME\n⌘F FINDS TEXT IN CLOSED ONES"}
      touch={"ONE SECTION OPEN AT A TIME\nTAP A TITLE TO OPEN IT"}
      tone="white"
      pattern="rules"
      title="Accordion."
      id="accordion"
      name="accordion"
      className={className}
    >
      <Measure full>
        <Accordion
          defaultValue={["shipping"]}
          collapsible={false}
          className={cn("flex flex-col divide-y divide-foreground bg-background", ink)}
        >
          {faq.map((entry) => (
            <AccordionItem key={entry.value} value={entry.value}>
              <AccordionHeader>
                <AccordionTrigger
                  className={cn(
                    "flex h-12 w-full items-center justify-between gap-4 px-4 text-start text-[15px] font-medium hover:bg-foreground/[0.04] aria-disabled:cursor-default aria-expanded:[&>svg]:rotate-180",
                    ring,
                    "focus-visible:-outline-offset-2",
                  )}
                >
                  {entry.label}
                  <ChevronDownIcon aria-hidden="true" className="size-4 shrink-0 transition-transform" />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel className="min-h-[4.75rem] px-4 sm:min-h-16 pb-4 text-sm text-pretty text-muted-foreground">
                {entry.body}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Measure>
    </ComponentPoster>
  )
}

function ResizableTile({ className, fig }: { className?: string; fig?: string }) {
  return (
    <ComponentPoster
      fig={fig}
      head={"RESIZE THE PANELS\nDRAG THE LINE OR\nUSE THE ARROWS"}
      touch={"RESIZE THE PANELS\nDRAG THE LINE"}
      pattern="columns"
      title="Resizable."
      id="resizable"
      name="resizable"
      className={className}
    >
      <Measure full>
        <Resizable className={cn("flex h-52 bg-background", ink)}>
          <ResizablePanel defaultSize={38} minSize={20} className="flex flex-col gap-1 overflow-hidden p-4">
            <span className={cn(label, "mb-2 text-muted-foreground")}>Files</span>
            {["page.tsx", "layout.tsx", "globals.css"].map((file) => (
              <span key={file} className="flex min-w-0 items-center gap-2 text-sm">
                <FileIcon aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="truncate">{file}</span>
              </span>
            ))}
          </ResizablePanel>
          <ResizableHandle
            aria-label="Resize files"
            className="relative w-px shrink-0 bg-foreground outline-none after:absolute after:inset-y-0 after:-start-2 after:w-4 after:cursor-col-resize pointer-coarse:after:-start-5 pointer-coarse:after:w-11 focus-visible:bg-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-[#006bff] data-dragging:outline-2 data-dragging:outline-[#006bff]"
          >
            <span className="absolute top-1/2 left-1/2 h-8 w-2 -translate-1/2 border border-foreground bg-background" />
          </ResizableHandle>
          <ResizablePanel minSize={30} className="flex flex-col gap-3 overflow-hidden p-4">
            <span className={cn(label, "text-muted-foreground")}>page.tsx</span>
            {[90, 70, 82, 45, 60].map((width, index) => (
              <span key={index} className="h-2 bg-foreground/15" style={{ width: `${width}%` }} />
            ))}
          </ResizablePanel>
        </Resizable>
      </Measure>
    </ComponentPoster>
  )
}

const marks = [
  { value: "bold", label: "Bold", Icon: BoldIcon },
  { value: "italic", label: "Italic", Icon: ItalicIcon },
  { value: "underline", label: "Underline", Icon: UnderlineIcon },
]

const aligns = [
  { value: "left", label: "Align left", Icon: AlignLeftIcon },
  { value: "center", label: "Align center", Icon: AlignCenterIcon },
  { value: "right", label: "Align right", Icon: AlignRightIcon },
]

const toggle = cn(
  "flex size-8 items-center justify-center transition-colors @[22rem]:size-9 @[24rem]:size-10 hover:bg-foreground/[0.06] data-pressed:bg-foreground data-pressed:text-background [&_svg]:size-4",
  ring,
)

function ToolbarTile({ className, fig }: { className?: string; fig?: string }) {
  const [marked, setMarked] = React.useState(["bold"])
  const [align, setAlign] = React.useState(["left"])
  return (
    <ComponentPoster
      fig={fig}
      head={"TAB ONCE TO GET IN\nTHEN USE THE ARROWS"}
      touch={"FORMAT THE TEXT\nTAP A BUTTON TO TURN IT ON"}
      tone="white"
      pattern="plus"
      title="Toolbar."
      id="toolbar"
      name="toolbar"
      className={className}
    >
      <Measure full>
        <div className={cn("flex flex-col bg-background", ink)}>
          <Toolbar
            aria-label="Formatting"
            className="flex flex-wrap items-center gap-1 border-b border-foreground p-1.5"
          >
            <ToggleGroup aria-label="Style" value={marked} onValueChange={setMarked} className="flex">
              {marks.map(({ value, label: name, Icon }) => (
                <Toggle key={value} value={value} aria-label={name} className={toggle}>
                  <Icon aria-hidden="true" />
                </Toggle>
              ))}
            </ToggleGroup>
            <ToolbarSeparator className="mx-1 h-6 w-px bg-foreground/30" />
            <ToggleGroup
              aria-label="Alignment"
              value={align}
              onValueChange={setAlign}
              deselectable={false}
              className="flex"
            >
              {aligns.map(({ value, label: name, Icon }) => (
                <Toggle key={value} value={value} aria-label={name} className={toggle}>
                  <Icon aria-hidden="true" />
                </Toggle>
              ))}
            </ToggleGroup>
          </Toolbar>
          <p
            className={cn(
              "p-5 text-lg leading-relaxed",
              marked.includes("bold") && "font-semibold",
              marked.includes("italic") && "italic",
              marked.includes("underline") && "underline underline-offset-4",
              align[0] === "center" && "text-center",
              align[0] === "right" && "text-end",
            )}
          >
            Every button is one arrow key away.
          </p>
        </div>
      </Measure>
    </ComponentPoster>
  )
}

function StartPoster({ fig }: { fig?: string }) {
  return (
    <Poster
      fig={fig}
      head={"TRY IT IN YOUR PROJECT\nSTART WITH THE DOCS"}
      pattern="hatch"
      body="justify-end"
      backdrop={
        <Numeral className="absolute end-[0.04em] top-1/2 hidden -translate-y-1/2 text-[length:36cqi] font-[300] transition-transform duration-300 group-has-[a:hover]/start:translate-x-[0.04em] lg:block">
          →
        </Numeral>
      }
      className="group/start lg:min-h-[28rem]"
    >
      <Link
        href="/docs"
        className="w-fit text-[length:clamp(2.5rem,11cqi,11rem)] leading-[0.82] after:absolute after:inset-0 font-[450] tracking-[-0.06em] whitespace-nowrap underline-offset-[0.08em] outline-none hover:underline focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-[#006bff]"
      >
        Start building.
      </Link>
    </Poster>
  )
}

export {
  AccordionTile,
  CalendarTile,
  Numeral,
  Pill,
  Title,
  ColorTile,
  CommandTile,
  Measure,
  NumberInputTile,
  OTPTile,
  Poster,
  RatingTile,
  ResizableTile,
  SegmentedTile,
  SliderTile,
  StartPoster,
  SwitchTile,
  TabsTile,
  TokenInputTile,
  ToolbarTile,
  TreeTile,
}
