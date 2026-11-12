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
import {
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "@ui-sdk/react/otp-input"
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
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/react/resizable"
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
import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
} from "@ui-sdk/react/tree"
import { formatColor, parseColor } from "@ui-sdk/core/color"
import { addDays, todayDate } from "@ui-sdk/core/date"
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
import * as React from "react"
import { hatch } from "./home-patterns"
import { slug } from "./home-posters"

const ink = "border border-foreground"
const ring =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff] has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-2 has-focus-visible:outline-[#006bff]"
const control = cn("h-8 bg-background text-sm transition-colors", ink, ring)
const button = cn(
  control,
  "inline-flex shrink-0 cursor-default items-center justify-center gap-1.5 px-3 font-medium select-none hover:bg-foreground/[0.06] [&_svg]:size-4"
)
const icon = cn(button, "size-8 px-0")
const item =
  "flex min-h-7 cursor-default items-center gap-2 px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-foreground data-highlighted:text-background [&_svg]:size-4"
const label = "font-mono text-[11px] tracking-[0.06em] uppercase"
const description = "text-[13px] text-muted-foreground"

function Measure({
  full = false,
  side = "top",
  shadow = false,
  className,
  children,
}: {
  full?: boolean
  side?: "top" | "bottom"
  shadow?: boolean
  className?: string
  children: React.ReactNode
}) {
  const box = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState<number | null>(null)
  React.useEffect(() => {
    const element = box.current
    if (!element) {
      return
    }
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.borderBoxSize[0].inlineSize))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  const rule = (
    <div
      aria-hidden="true"
      className="flex h-2 items-center text-[color-mix(in_oklab,var(--foreground)_35%,var(--background))] dark:text-[color-mix(in_oklab,var(--foreground)_45%,var(--background))]"
    >
      <span className="h-full w-px bg-current" />
      <span className="h-px flex-1 bg-current" />
      <span className="min-w-8 px-2 text-center font-mono text-[9px] leading-none text-muted-foreground tabular-nums">
        {width ?? ""}
      </span>
      <span className="h-px flex-1 bg-current" />
      <span className="h-full w-px bg-current" />
    </div>
  )
  return (
    <div
      className={cn(
        "flex flex-col gap-[3cqi]",
        full ? "w-full" : "w-fit max-w-full",
        className
      )}
    >
      {side === "top" && rule}
      <div ref={box} className="relative isolate">
        {shadow && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 translate-[2.5cqi]"
            style={hatch}
          />
        )}
        {children}
      </div>
      {side === "bottom" && rule}
    </div>
  )
}

// The homepage is built ahead of time, so the range starts from the day it was
// built, which the server and the browser agree on, rather than from today.
const rangeStart = addDays(process.env.BUILD_DAY ?? todayDate(), 3)
const range: [string, string] = [rangeStart, addDays(rangeStart, 4)]

function CalendarDemo() {
  return (
    <Measure shadow>
      <Calendar
        mode="range"
        fixedWeeks
        defaultValue={range}
        className={cn("bg-background p-3", ink)}
      >
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
                  "size-[clamp(2rem,9.2cqi,3.25rem)] text-center text-[length:clamp(0.8125rem,3.5cqi,1.125rem)] tabular-nums transition-colors hover:bg-foreground/[0.06] data-outside:text-muted-foreground data-today:underline data-today:underline-offset-4",
                  "data-range-middle:bg-foreground/[0.08]",
                  "[&[data-selected]:not([data-range-middle])]:bg-foreground [&[data-selected]:not([data-range-middle])]:text-background",
                  ring
                )}
              />
            )}
          </CalendarWeeks>
        </CalendarGrid>
      </Calendar>
    </Measure>
  )
}

const commands = [
  { group: "Pages", value: "dashboard", label: "Dashboard" },
  { group: "Pages", value: "projects", label: "Projects" },
  { group: "Pages", value: "calendar", label: "Calendar" },
  { group: "Account", value: "profile", label: "Profile" },
  { group: "Account", value: "billing", label: "Billing" },
  { group: "Account", value: "settings", label: "Settings" },
]

function CommandDemo() {
  return (
    <Measure full side="bottom" shadow>
      <Command
        className={cn("flex h-[max(22rem,82cqi)] flex-col bg-background", ink)}
      >
        <div className="flex items-center gap-3 border-b border-foreground px-4 has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:-outline-offset-2 has-focus-visible:outline-[#006bff]">
          <span
            aria-hidden="true"
            className="font-mono text-sm text-muted-foreground"
          >
            &gt;
          </span>
          <CommandInput
            aria-label="Search commands"
            placeholder="Go to..."
            className="h-[max(2.75rem,12cqi)] w-full min-w-0 bg-transparent text-[length:clamp(1rem,4cqi,1.25rem)] tracking-[-0.01em] outline-none placeholder:text-muted-foreground"
          />
        </div>
        <CommandEmpty className="flex flex-1 items-center justify-center font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase empty:hidden">
          Nothing found
        </CommandEmpty>
        <CommandList className="min-h-0 flex-1 overflow-y-auto p-1.5">
          {["Pages", "Account"].map((group) => (
            <CommandGroup key={group}>
              <CommandGroupLabel
                className={cn(
                  label,
                  "px-2.5 pt-3 pb-1.5 text-muted-foreground"
                )}
              >
                {group}
              </CommandGroupLabel>
              {commands
                .filter((command) => command.group === group)
                .map((command) => (
                  <CommandItem
                    key={command.value}
                    value={command.value}
                    className="flex h-[max(2rem,7.4cqi)] cursor-default items-center px-2.5 text-[length:clamp(0.875rem,3.4cqi,1rem)] outline-none select-none data-highlighted:bg-foreground data-highlighted:text-background"
                  >
                    {command.label}
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
  )
}

const slot = cn(
  "relative -ms-px flex aspect-[5/6] min-w-0 flex-1 items-center justify-center bg-background text-[length:max(1.5rem,9cqi)] tabular-nums first:ms-0 data-active:z-10 data-active:outline-2 data-active:outline-offset-0 data-active:outline-[#006bff]",
  ink,
  "[&[data-fake-caret]:empty]:after:h-4 [&[data-fake-caret]:empty]:after:w-px [&[data-fake-caret]:empty]:after:animate-caret-blink [&[data-fake-caret]:empty]:after:bg-foreground [&[data-fake-caret]:empty]:after:content-['']"
)

function OTPDemo() {
  return (
    <Measure full side="bottom">
      <OTPInput
        maxLength={6}
        defaultValue="482"
        aria-label="Verification code"
        className="grid w-full grid-cols-[1fr_2rem_1fr] items-center"
      >
        <OTPInputGroup className="flex">
          {[0, 1, 2].map((index) => (
            <OTPInputSlot key={index} index={index} className={slot} />
          ))}
        </OTPInputGroup>
        <OTPInputSeparator className="flex justify-center text-muted-foreground">
          <MinusIcon aria-hidden="true" className="size-3" />
        </OTPInputSeparator>
        <OTPInputGroup className="flex">
          {[3, 4, 5].map((index) => (
            <OTPInputSlot key={index} index={index} className={slot} />
          ))}
        </OTPInputGroup>
      </OTPInput>
    </Measure>
  )
}

const step =
  "flex h-full w-[22%] shrink-0 items-center justify-center hover:bg-foreground/[0.06] disabled:text-muted-foreground/50 [&_svg]:size-[max(1rem,4cqi)]"

function Star() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[11cqi] fill-current"
    >
      <polygon points="12 1.4 14.58 9.35 22.94 9.35 16.18 14.26 18.76 22.2 12 17.29 5.24 22.2 7.82 14.26 1.06 9.35 9.42 9.35" />
    </svg>
  )
}

function RatingDemo() {
  const [value, setValue] = React.useState<number | null>(4)
  return (
    <Measure>
      <Rating
        aria-label="Your stay"
        value={value}
        onValueChange={setValue}
        className="flex justify-between gap-[2.5cqi]"
      >
        <RatingItem className="group/star relative inline-flex cursor-default text-foreground/15 has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-2 has-focus-visible:outline-[#006bff]">
          <Star />
          <span className="absolute inset-y-0 start-0 w-[calc(var(--rating-fill)*100%)] overflow-hidden text-foreground group-data-highlighted/star:text-foreground/50">
            <Star />
          </span>
        </RatingItem>
      </Rating>
    </Measure>
  )
}

function NumberInputDemo() {
  return (
    <Measure full side="bottom">
      <NumberInput defaultValue={2} min={1} max={100}>
        <NumberInputScrubArea
          pixelsPerStep={16}
          className="mb-3 flex cursor-ew-resize flex-col gap-1.5 font-mono text-[10px] text-muted-foreground select-none hover:text-foreground"
        >
          <span className="flex items-center justify-between tracking-[0.06em] uppercase">
            Guests
            <span>Drag to scrub ↔</span>
          </span>
          <span
            aria-hidden="true"
            className="flex h-2.5 items-end justify-between"
          >
            {Array.from({ length: 29 }, (_, index) => (
              <span
                key={index}
                className={cn(
                  "w-px bg-current",
                  index % 4 === 0 ? "h-full" : "h-1.5"
                )}
              />
            ))}
          </span>
          <NumberInputScrubAreaCursor className="text-foreground">
            <MoveHorizontalIcon aria-hidden="true" className="size-4" />
          </NumberInputScrubAreaCursor>
        </NumberInputScrubArea>
        <NumberInputGroup
          className={cn(
            "flex h-[max(4.5rem,17cqi)] w-full items-center bg-background",
            ink,
            "has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-2 has-focus-visible:outline-[#006bff]"
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
            className="w-full min-w-0 flex-1 bg-transparent text-center text-[length:max(2.5rem,11cqi)] tracking-tight tabular-nums outline-none"
          />
          <NumberInputIncrement
            aria-label="More guests"
            className={cn(step, "border-s border-foreground")}
          >
            <PlusIcon aria-hidden="true" />
          </NumberInputIncrement>
        </NumberInputGroup>
      </NumberInput>
    </Measure>
  )
}

const switches = [
  {
    title: "Weekly digest",
    body: "A summary of your week, every Monday.",
    on: true,
  },
  { title: "Mentions", body: "Only when someone mentions you.", on: false },
  {
    title: "Product news",
    body: "New features, a few times a year.",
    on: true,
  },
]

function SwitchDemo() {
  return (
    <Measure full>
      <div
        className={cn(
          "flex flex-col divide-y divide-foreground/15 bg-background",
          ink
        )}
      >
        {switches.map((setting) => (
          <div
            key={setting.title}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div className="flex flex-col gap-1">
              <Label
                htmlFor={`setting-${slug(setting.title)}`}
                className={cn(label, "cursor-default")}
              >
                {setting.title}
              </Label>
              <span
                id={`setting-${slug(setting.title)}-description`}
                className={description}
              >
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
                ring
              )}
            >
              <SwitchThumb className="size-3 bg-foreground transition-transform group-data-checked/switch:translate-x-4 group-data-checked/switch:bg-background rtl:group-data-checked/switch:-translate-x-4" />
            </Switch>
          </div>
        ))}
      </div>
    </Measure>
  )
}

function SliderDemo() {
  const [value, setValue] = React.useState(20)
  const frame = React.useRef<HTMLDivElement>(null)
  const note = React.useRef<HTMLSpanElement>(null)
  const [path, setPath] = React.useState("")

  React.useLayoutEffect(() => {
    const element = frame.current
    const marker = note.current
    if (!element || !marker) {
      return
    }
    const draw = () => {
      const thumb = element.querySelector("[data-slot=slider-thumb]")
      if (!thumb) {
        return
      }
      const origin = element.getBoundingClientRect()
      const end = thumb.getBoundingClientRect()
      const box = marker.getBoundingClientRect()
      const rtl = getComputedStyle(element).direction === "rtl"
      const x = end.left + end.width / 2 - origin.left
      const y = end.top - origin.top
      const boxX = (rtl ? box.right : box.left) - origin.left
      const boxY = box.top + box.height / 2 - origin.top
      const elbow = boxX + (rtl ? 1 : -1) * Math.max(16, box.height * 2.4)
      setPath(`M ${x} ${y} L ${elbow} ${boxY} L ${boxX} ${boxY}`)
    }
    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(element)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={frame} className="relative flex w-full flex-col gap-[16cqi]">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible text-foreground"
      >
        {path && (
          <path d={path} fill="none" stroke="currentColor" strokeWidth={1} />
        )}
      </svg>
      <div className="flex items-start gap-2 ps-[42%]">
        <span
          ref={note}
          aria-hidden="true"
          className="flex size-4 shrink-0 items-center justify-center border border-foreground font-mono text-[9px] leading-none"
        >
          1
        </span>
        <p className="font-mono text-[9px] leading-[1.55] tracking-[0.08em] text-muted-foreground uppercase @[26rem]:text-[10px] @[36rem]:text-[11px]">
          <span className="block">Set the volume</span>
          <span className="block">Drag or tap the track</span>
        </p>
      </div>
      <Measure full shadow>
        <Slider
          value={value}
          onValueChange={setValue}
          className={cn("flex flex-col gap-4 bg-background p-4", ink)}
        >
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
                className={cn(
                  "size-4 bg-background data-dragging:bg-foreground",
                  ink,
                  ring
                )}
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
    </div>
  )
}

function SegmentedDemo() {
  return (
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
              "relative h-[max(3.5rem,14.5cqi)] min-w-0 flex-1 px-2 text-[length:max(1.125rem,4.6cqi)] font-medium text-muted-foreground transition-colors data-checked:text-background",
              ring
            )}
          >
            {view}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </Measure>
  )
}

const presets = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#0ea5e9",
  "#6366f1",
  "#a855f7",
  "#ec4899",
]
const thumb = cn(
  "absolute size-3.5 border-2 border-white bg-(--color-picker-color) shadow-[0_0_0_1px_rgb(0_0_0/0.5)]",
  ring
)

const formats = [
  { value: "hex", label: "HEX" },
  { value: "srgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "oklch", label: "OKLCH" },
] as const

function ColorDemo() {
  const [format, setFormat] =
    React.useState<(typeof formats)[number]["value"]>("hex")
  const [value, setValue] = React.useState("#6366f1")
  return (
    <Measure side="bottom">
      <ColorPicker
        aria-label="Brand color"
        value={value}
        onValueChange={setValue}
        format={format}
        className={cn(
          "flex w-[max(15rem,64cqi)] max-w-full flex-col gap-3 bg-background p-3 [&_[data-slot=color-picker-area-canvas]]:grayscale [&_[data-slot=color-picker-area-thumb]]:grayscale [&_[data-slot=color-picker-slider]]:grayscale [&_[data-slot=color-picker-swatch-item]]:grayscale [&_[data-slot=color-picker-swatch]]:grayscale",
          ink
        )}
      >
        <ColorPickerArea className="relative h-[max(7rem,35cqi)] cursor-crosshair border border-foreground">
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
                "top-1/2 translate-x-[calc(var(--color-slider-thumb-position)*-1)] -translate-y-1/2"
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
            if (color) {
              setValue(formatColor(color, next as typeof format))
            }
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
                ring
              )}
            >
              {entry.label}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
        <div className="flex gap-2">
          <ColorPickerInput
            aria-label="Color"
            className={cn(
              control,
              "min-w-0 flex-1 px-2.5 font-mono text-[12px] pointer-coarse:text-base"
            )}
          />
        </div>
        <ColorPickerSwatches
          aria-label="Presets"
          className="grid grid-cols-8 gap-1.5"
        >
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
    <TreeItem
      key={node.value}
      value={node.value}
      className="group/item outline-none"
    >
      <TreeItemLabel className="flex h-[max(2rem,7.4cqi)] items-center gap-2 ps-[calc(0.5rem+(var(--tree-level,1)-1)*1rem)] pe-3 text-[length:clamp(0.875rem,3.4cqi,1rem)] whitespace-nowrap select-none [:focus-visible>&]:outline-2 [:focus-visible>&]:outline-solid [:focus-visible>&]:-outline-offset-2 [:focus-visible>&]:outline-[#006bff] hover:bg-foreground/[0.06] data-selected:bg-foreground data-selected:text-background [&>svg]:size-4 [&>svg]:shrink-0">
        {node.children ? (
          <TreeItemIndicator className="flex size-4 items-center justify-center transition-transform data-expanded:rotate-90 rtl:-scale-x-100">
            <ChevronRightIcon aria-hidden="true" className="size-3.5" />
          </TreeItemIndicator>
        ) : (
          <span className="size-4" />
        )}
        {node.children ? (
          <FolderIcon aria-hidden="true" />
        ) : (
          <FileIcon aria-hidden="true" />
        )}
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

function TreeDemo() {
  return (
    <Measure full side="bottom">
      <Tree
        aria-label="Files"
        defaultExpanded={["app", "components"]}
        defaultValue="app/page.tsx"
        className={cn("flex min-w-max flex-col bg-background p-1", ink)}
      >
        <Files items={files} />
      </Tree>
    </Measure>
  )
}

const periods = [
  {
    value: "week",
    label: "Week",
    total: "12.4k",
    change: "+8%",
    bars: [32, 48, 40, 64, 52, 76, 94],
  },
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
  "h-[max(2.25rem,9cqi)] min-w-0 flex-1 px-2 text-[length:clamp(0.8125rem,3.2cqi,1rem)] font-medium text-muted-foreground transition-colors select-none hover:text-foreground data-selected:bg-foreground data-selected:text-background",
  ring
)

function TabsDemo() {
  return (
    <Measure full side="bottom">
      <Tabs
        defaultValue="week"
        className={cn("flex flex-col bg-background", ink)}
      >
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
            <div
              aria-hidden="true"
              className="flex h-[max(8rem,30cqi)] items-end gap-[1.6cqi]"
            >
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
  )
}

const mentions = [
  { value: "app/page.tsx", label: "page.tsx", keywords: ["app"] },
  { value: "app/layout.tsx", label: "layout.tsx", keywords: ["app"] },
  {
    value: "components/calendar.tsx",
    label: "calendar.tsx",
    keywords: ["components"],
  },
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

function TokenInputDemo() {
  return (
    <Measure full side="bottom">
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
            "relative min-h-[max(8rem,32cqi)] bg-background p-[max(1rem,4cqi)] text-[length:clamp(1rem,3.8cqi,1.25rem)] leading-[1.75] outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff] data-empty:before:pointer-events-none data-empty:before:absolute data-empty:before:text-muted-foreground data-empty:before:content-[attr(aria-placeholder)]",
            ink
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
            <TriggerMenuEmpty
              className={cn(
                label,
                "px-2 py-3 text-muted-foreground empty:hidden"
              )}
            >
              No matches
            </TriggerMenuEmpty>
            <TriggerMenuList>
              {(state) =>
                (state.items as (TriggerMenuDataItem | string)[]).map(
                  (entry) => {
                    const option =
                      typeof entry === "string"
                        ? { value: entry, label: entry }
                        : entry
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
                  }
                )
              }
            </TriggerMenuList>
          </TriggerMenuContent>
        </TriggerMenu>
      </TokenInput>
    </Measure>
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

function AccordionDemo() {
  return (
    <Measure full>
      <Accordion
        defaultValue={["shipping"]}
        collapsible={false}
        className={cn(
          "flex flex-col divide-y divide-foreground bg-background",
          ink
        )}
      >
        {faq.map((entry) => (
          <AccordionItem key={entry.value} value={entry.value}>
            <AccordionHeader>
              <AccordionTrigger
                className={cn(
                  "flex h-[max(2.75rem,10.5cqi)] w-full items-center justify-between gap-4 px-4 text-start text-[length:clamp(0.875rem,3.4cqi,1rem)] font-medium hover:bg-foreground/[0.04] aria-disabled:cursor-default aria-expanded:[&>svg]:rotate-180",
                  ring,
                  "focus-visible:-outline-offset-2"
                )}
              >
                {entry.label}
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 transition-transform"
                />
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel className="min-h-[4.75rem] px-4 sm:min-h-16 pb-4 text-sm text-pretty text-muted-foreground">
              {entry.body}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Measure>
  )
}

function ResizableDemo() {
  return (
    <Measure full>
      <Resizable className={cn("flex h-[max(10rem,41cqi)] bg-background", ink)}>
        <ResizablePanel
          defaultSize={38}
          minSize={20}
          className="flex flex-col gap-1 overflow-hidden p-4"
        >
          <span className={cn(label, "mb-2 text-muted-foreground")}>Files</span>
          {["page.tsx", "layout.tsx", "globals.css"].map((file) => (
            <span
              key={file}
              className="flex min-w-0 items-center gap-2 text-sm"
            >
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
        <ResizablePanel
          minSize={30}
          className="flex flex-col gap-3 overflow-hidden p-4"
        >
          <span className={cn(label, "text-muted-foreground")}>page.tsx</span>
          {[90, 70, 82, 45, 60].map((width, index) => (
            <span
              key={index}
              className="h-2 bg-foreground/15"
              style={{ width: `${width}%` }}
            />
          ))}
        </ResizablePanel>
      </Resizable>
    </Measure>
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
  ring
)

function ToolbarDemo() {
  const [marked, setMarked] = React.useState(["bold"])
  const [align, setAlign] = React.useState(["left"])
  return (
    <Measure full>
      <div className={cn("flex flex-col bg-background", ink)}>
        <Toolbar
          aria-label="Formatting"
          className="flex flex-wrap items-center gap-1 border-b border-foreground p-1.5"
        >
          <ToggleGroup
            aria-label="Style"
            value={marked}
            onValueChange={setMarked}
            className="flex"
          >
            {marks.map(({ value, label: name, Icon }) => (
              <Toggle
                key={value}
                value={value}
                aria-label={name}
                className={toggle}
              >
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
              <Toggle
                key={value}
                value={value}
                aria-label={name}
                className={toggle}
              >
                <Icon aria-hidden="true" />
              </Toggle>
            ))}
          </ToggleGroup>
        </Toolbar>
        <p
          className={cn(
            "p-[max(1rem,4.5cqi)] text-[length:clamp(0.875rem,3.6cqi,1.125rem)] leading-relaxed",
            marked.includes("bold") && "font-semibold",
            marked.includes("italic") && "italic",
            marked.includes("underline") && "underline underline-offset-4",
            align[0] === "center" && "text-center",
            align[0] === "right" && "text-end"
          )}
        >
          Every button is one arrow key away.
        </p>
      </div>
    </Measure>
  )
}

export {
  AccordionDemo,
  CalendarDemo,
  ColorDemo,
  CommandDemo,
  NumberInputDemo,
  OTPDemo,
  RatingDemo,
  ResizableDemo,
  SegmentedDemo,
  SliderDemo,
  SwitchDemo,
  TabsDemo,
  TokenInputDemo,
  ToolbarDemo,
  TreeDemo,
}
