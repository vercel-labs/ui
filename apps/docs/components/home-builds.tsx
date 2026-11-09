"use client"

import {
  createChange,
  createResize,
  createSpans,
  definePrimitive,
  live,
  type ResizeBox,
  type ResizeDraft,
  type ResizeHandle,
  type Span,
  type SpansDraft,
} from "@ui-sdk/core"
import {
  NumberInput,
  NumberInputControl,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
} from "@ui-sdk/react/number-input"
import { cropImage } from "@ui-sdk/react/image"
import {
  ImageCropper,
  ImageCropperFlip,
  ImageCropperGrid,
  ImageCropperHandle,
  ImageCropperImage,
  ImageCropperRotate,
  ImageCropperSelection,
  ImageCropperViewport,
  type ImageCrop,
} from "@ui-sdk/react/image-cropper"
import { createParts } from "@ui-sdk/react/primitive"
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control"
import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/react/slider"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"
import { cn } from "cn"
import {
  FlipHorizontal2Icon,
  FlipVertical2Icon,
  RotateCwIcon,
  CircleIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SquareIcon,
  TypeIcon,
  Volume2Icon,
  VolumeXIcon,
  MoveHorizontalIcon,
} from "lucide-react"
import * as React from "react"
import { Numeral, Pill, Poster, Title } from "./home-posters"

const ink = "border border-foreground"
const ring =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff] has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-2 has-focus-visible:outline-[#006bff]"
const label = "font-mono text-[10px] tracking-[0.06em] uppercase"
const press = cn(
  "inline-flex h-7 min-w-7 shrink-0 cursor-default items-center justify-center gap-1.5 bg-background px-2 font-mono text-[10px] tracking-[0.06em] uppercase select-none hover:bg-foreground/[0.06] data-pressed:bg-foreground data-pressed:text-background [&_svg]:size-3.5",
  ink,
  ring,
)

type BoardState = { boxes: Record<string, ResizeBox>; draft: ResizeDraft | null }

type BoardOptions = {
  boxes?: Record<string, ResizeBox>
  defaultBoxes: Record<string, ResizeBox>
  width: number
  height: number
  scale?: number
  step?: number
  min?: number
  onBoxesChange?: (boxes: Record<string, ResizeBox>) => void
}

const board = definePrimitive({
  name: "board",
  options: {
    boxes: "value",
    defaultBoxes: "value",
    width: "number",
    height: "number",
    scale: "number",
    step: "number",
    min: "number",
    onBoxesChange: "callback",
  },
  state: (options: BoardOptions): BoardState => ({
    boxes: options.boxes ?? options.defaultBoxes,
    draft: null,
  }),
  sync: (options) => (options.boxes === undefined ? {} : { boxes: options.boxes }),
  live: ["draft"],
  api: (context) => {
    const change = createChange(context)
    return {
      resize: createResize<BoardState>(context, {
        boxes: (state) => state.boxes,
        draft: "draft",
        set: (value, details) => change("boxes", value, details),
        min: () => ({ width: context.options().min ?? 40, height: context.options().min ?? 40 }),
        bounds: () => ({ left: 0, top: 0, right: context.options().width, bottom: context.options().height }),
        step: () => context.options().step ?? 4,
        scale: () => context.options().scale ?? 1,
      }),
    }
  },
  slots: (slot) => ({
    root: slot<{}, { boxes: Record<string, ResizeBox>; active: string | null }>({
      state: (state) => ({
        boxes:
          state.draft && state.draft.handle !== "move"
            ? { ...state.boxes, [state.draft.key]: state.draft.box }
            : state.boxes,
        active: state.draft?.key ?? null,
      }),
    }),
    box: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, { api, key }) => ({
        tabindex: "0",
        style: `${api.resize.boxStyle(state, key)};touch-action:none`,
      }),
      live: live<BoardState, any, { value: string }>((state, { api, key }) => ({
        "data-dragging": state.draft?.key === key ? "" : undefined,
        style: api.resize.style(state, key),
      })),
      on: {
        pointerdown: (event, { el, api, key }) => api.resize.pointerdown(event, key, "move", el!),
        keydown: (event, { api, key }) => api.resize.keydown(event, key, "move"),
      },
    }),
    handle: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (_state, { api, key }) => ({
        type: "button",
        tabindex: "-1",
        ...api.resize.handleAttrs(key.split(":")[1] as ResizeHandle),
      }),
      on: {
        pointerdown: (event, { el, api, key }) => {
          const [box, handle] = key.split(":")
          return api.resize.pointerdown(event, box, handle as ResizeHandle, el!)
        },
      },
    }),
  }),
})

const boardParts = createParts(board, { root: "div", box: "div", handle: "button" })
const Board = boardParts.Root
const BoardBox = boardParts.Box
const BoardHandle = boardParts.Handle

function useFit(width: number) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)
  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [width])
  return [ref, scale] as const
}

const corners: ResizeHandle[] = ["nw", "ne", "se", "sw"]

function Handles({ box }: { box: string }) {
  return corners.map((handle) => (
    <BoardHandle
      key={handle}
      value={`${box}:${handle}`}
      aria-hidden="true"
      className={cn(
        "absolute z-10 hidden size-2.5 border border-foreground bg-background group-focus-within/box:block group-hover/box:block group-data-dragging/box:block after:absolute after:-inset-2 pointer-coarse:after:-inset-4",
        handle === "nw" && "-start-[5px] -top-[5px]",
        handle === "ne" && "-end-[5px] -top-[5px]",
        handle === "se" && "-end-[5px] -bottom-[5px]",
        handle === "sw" && "-start-[5px] -bottom-[5px]",
      )}
    />
  ))
}

const rooms: Record<string, ResizeBox> = {
  living: { x: 0, y: 0, width: 360, height: 240 },
  kitchen: { x: 360, y: 0, width: 280, height: 160 },
  bedroom: { x: 360, y: 160, width: 280, height: 240 },
  bath: { x: 0, y: 240, width: 140, height: 160 },
  study: { x: 140, y: 240, width: 220, height: 160 },
}
const names: Record<string, string> = {
  living: "Living",
  kitchen: "Kitchen",
  bedroom: "Bedroom",
  bath: "Bath",
  study: "Study",
}
const unit = 40

function meters(value: number, feet: boolean) {
  const m = value / unit
  return feet ? `${(m * 3.281).toFixed(1)}′` : `${m.toFixed(2)}`
}

function Furniture({ room }: { room: string }) {
  const piece = "absolute border border-foreground/60"
  if (room === "living")
    return (
      <>
        <span className={cn(piece, "start-[12%] bottom-[14%] h-[22%] w-[52%]")} />
        <span className={cn(piece, "start-[24%] bottom-[44%] h-[18%] w-[26%] rounded-full")} data-round="" />
      </>
    )
  if (room === "kitchen")
    return (
      <>
        <span className={cn(piece, "inset-x-[8%] bottom-[16%] h-[16%]")} />
        <span className={cn(piece, "end-[10%] top-[14%] h-[30%] w-[22%] rounded-full")} data-round="" />
      </>
    )
  if (room === "bedroom")
    return (
      <>
        <span className={cn(piece, "end-[12%] top-[22%] h-[52%] w-[42%]")} />
        <span className={cn(piece, "end-[12%] top-[22%] h-[12%] w-[42%]")} />
      </>
    )
  if (room === "bath")
    return (
      <span className={cn(piece, "end-[18%] bottom-[16%] h-[44%] w-[34%] rounded-[40%]")} data-round="" />
    )
  return <span className={cn(piece, "end-[14%] bottom-[22%] h-[20%] w-[52%]")} />
}

const Room = React.memo(function Room({
  room,
  box,
  active,
  feet,
  dimensions,
  furniture,
}: {
  room: string
  box: ResizeBox
  active: boolean
  feet: boolean
  dimensions: boolean
  furniture: boolean
}) {
  return (
    <BoardBox
      key={room}
      value={room}
      aria-label={`${names[room]}, ${meters(box.width, feet)} by ${meters(box.height, feet)}. Arrow keys move it.`}
      className={cn(
        "group/box cursor-move border-[3px] border-foreground bg-(--poster) outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff] focus-visible:z-20 focus-visible:bg-[color-mix(in_oklab,var(--foreground)_6%,var(--poster))] data-dragging:z-20 data-dragging:bg-[color-mix(in_oklab,var(--foreground)_8%,var(--poster))]",
        active && "z-20",
      )}
    >
      {furniture && <Furniture room={room} />}
      <span className="absolute start-3 top-2.5 flex flex-col gap-0.5">
        <span className="text-[15px] font-medium tracking-[-0.02em]">{names[room]}</span>
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {(((box.width * box.height) / unit ** 2) * (feet ? 10.764 : 1)).toFixed(1)} {feet ? "sq ft" : "m²"}
        </span>
      </span>
      {dimensions && (
        <>
          <span className="absolute inset-x-2 bottom-1.5 flex items-center gap-1 font-mono text-[10px] text-muted-foreground tabular-nums">
            <span className="h-px flex-1 bg-current" />
            {meters(box.width, feet)}
            <span className="h-px flex-1 bg-current" />
          </span>
          <span className="absolute inset-y-2 end-1.5 flex flex-col items-center gap-1 font-mono text-[10px] text-muted-foreground tabular-nums">
            <span className="w-px flex-1 bg-current" />
            <span className="[writing-mode:vertical-rl]">{meters(box.height, feet)}</span>
            <span className="w-px flex-1 bg-current" />
          </span>
        </>
      )}
      <Handles box={room} />
    </BoardBox>
  )
})

function PlanTile({ className, fig }: { className?: string; fig?: string }) {
  const [ref, scale] = useFit(640)
  const [feet, setFeet] = React.useState(false)
  const [show, setShow] = React.useState({ dimensions: true, furniture: true, grid: true })
  return (
    <Poster
      fig={fig}
      head={"MOVE THE ROOMS AROUND\nPULL A CORNER TO GROW ONE"}
      tone="white"
      pattern="grid"
      body="justify-between gap-8"
      className={className}
    >
      <Board
        defaultBoxes={rooms}
        width={640}
        height={400}
        scale={scale}
        step={10}
        className="flex flex-col gap-8 select-none"
      >
        {({ boxes, active }) => {
          const area = Object.values(boxes).reduce(
            (sum, box) => sum + (box.width * box.height) / unit ** 2,
            0,
          )
          return (
            <>
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-baseline gap-2">
                  <Numeral className="-ms-[0.06em] text-[length:clamp(2rem,6cqi,3.5rem)]">
                    {(feet ? area * 10.764 : area).toFixed(feet ? 0 : 1)}
                  </Numeral>
                  <span className={cn(label, "text-muted-foreground")}>{feet ? "sq ft" : "m²"} total</span>
                </div>
                <div aria-hidden="true" className="hidden shrink-0 items-end gap-6 @[28rem]:flex">
                  <div className="flex flex-col items-start gap-1.5 font-mono text-[10px] text-muted-foreground tabular-nums">
                    <div className="flex border border-foreground">
                      {[0, 1, 2, 3].map((block) => (
                        <span
                          key={block}
                          className="h-2 odd:bg-foreground"
                          style={{ width: (unit / 2) * scale }}
                        />
                      ))}
                    </div>
                    <div className="flex">
                      {[0, 1, 2].map((mark) => (
                        <span key={mark} className="last:w-auto" style={{ width: unit * scale }}>
                          {mark}
                        </span>
                      ))}
                      <span className="ms-1">m</span>
                    </div>
                  </div>
                  <svg viewBox="0 0 32 52" className="h-14 w-auto text-foreground">
                    <text x="16" y="10" textAnchor="middle" className="fill-current font-mono text-[11px]">
                      N
                    </text>
                    <path d="M16 15 L25 47 L16 40 Z" className="fill-current" />
                    <path d="M16 15 L7 47 L16 40 Z" className="fill-none stroke-current" strokeWidth="1.25" />
                  </svg>
                </div>
              </div>
              <div ref={ref} className="relative w-full" style={{ height: 400 * scale }}>
                <div
                  className={cn(
                    "absolute start-0 top-0 h-[400px] w-[640px] origin-top-left rtl:origin-top-right",
                    show.grid &&
                      "bg-[linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_10%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_10%,transparent)_1px,transparent_1px)] bg-size-[40px_40px]",
                  )}
                  style={{ transform: `scale(${scale})` }}
                >
                  {Object.keys(rooms).map((room) => (
                    <Room
                      key={room}
                      room={room}
                      box={boxes[room]}
                      active={active === room}
                      feet={feet}
                      dimensions={show.dimensions}
                      furniture={show.furniture}
                    />
                  ))}
                </div>
              </div>
              <Title id="floor-plan" max={6.5} className="self-end -me-[0.04em]">
                Floor Plan.
              </Title>
            </>
          )
        }}
      </Board>
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {(["dimensions", "furniture", "grid"] as const).map((layer) => (
            <label key={layer} className={cn(label, "flex items-center gap-2")}>
              <Switch
                checked={show[layer]}
                onCheckedChange={(checked) => setShow((current) => ({ ...current, [layer]: checked }))}
                className={cn(
                  "group/switch inline-flex h-5 w-9 shrink-0 items-center bg-background p-[3px] transition-colors data-checked:bg-foreground",
                  ink,
                  ring,
                )}
              >
                <SwitchThumb className="size-3 bg-foreground transition-transform group-data-checked/switch:translate-x-4 group-data-checked/switch:bg-background rtl:group-data-checked/switch:-translate-x-4" />
              </Switch>
              {layer}
            </label>
          ))}
          <SegmentedControl
            aria-label="Units"
            value={feet ? "ft" : "m"}
            onValueChange={(value) => setFeet(value === "ft")}
            className={cn("relative inline-flex bg-background", ink)}
          >
            <SegmentedControlIndicator className="absolute top-(--segmented-control-indicator-top) left-(--segmented-control-indicator-left) h-(--segmented-control-indicator-height) w-(--segmented-control-indicator-width) bg-foreground transition-[left,width] duration-200" />
            {["m", "ft"].map((value) => (
              <SegmentedControlItem
                key={value}
                value={value}
                className={cn(
                  "relative h-7 px-3 font-mono text-[11px] text-muted-foreground transition-colors data-checked:text-background",
                  ring,
                )}
              >
                {value}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </div>
      </div>
    </Poster>
  )
}

const shapes: Record<string, ResizeBox> = {
  frame: { x: 24, y: 24, width: 240, height: 168 },
  circle: { x: 300, y: 56, width: 136, height: 136 },
  text: { x: 120, y: 216, width: 280, height: 72 },
}
const layers = [
  { value: "frame", label: "Rectangle", icon: SquareIcon },
  { value: "circle", label: "Ellipse", icon: CircleIcon },
  { value: "text", label: "Text", icon: TypeIcon },
]
const fills = [
  { value: "white", label: "White", className: "bg-background" },
  { value: "gray", label: "Gray", className: "bg-foreground/15" },
  { value: "ink", label: "Ink", className: "bg-foreground" },
  {
    value: "hatch",
    label: "Hatch",
    className:
      "bg-[repeating-linear-gradient(-45deg,var(--foreground)_0_1px,transparent_1px_7px)] bg-background",
  },
]

const Shape = React.memo(function Shape({
  layer,
  selected,
  fill,
  opacity,
  onSelect,
}: {
  layer: (typeof layers)[number]
  selected: boolean
  fill: string
  opacity: number
  onSelect: (value: string) => void
}) {
  return (
    <BoardBox
      value={layer.value}
      aria-label={`${layer.label}. Arrow keys move it.`}
      onFocus={() => onSelect(layer.value)}
      className={cn(
        "group/box cursor-move outline-none",
        selected && "z-10 outline-1 outline-offset-0 outline-foreground [outline-style:dashed]",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-[#006bff]",
      )}
      style={{ opacity: opacity / 100 }}
    >
      {layer.value === "text" ? (
        <span
          className={cn(
            "flex size-full items-center px-3 text-[40px] leading-none font-[450] tracking-[-0.05em]",
            fill === "ink" && "bg-foreground text-background",
            fill === "gray" && "bg-foreground/15",
            fill === "hatch" && fills[3].className,
          )}
        >
          Behaviors.
        </span>
      ) : (
        <span
          data-round={layer.value === "circle" ? "" : undefined}
          className={cn(
            "block size-full border border-foreground",
            layer.value === "circle" && "rounded-full",
            fills.find((entry) => entry.value === fill)?.className,
          )}
        />
      )}
      {selected && <Handles box={layer.value} />}
    </BoardBox>
  )
})

const CanvasLayers = React.memo(function CanvasLayers({
  selected,
  onSelect: setSelected,
}: {
  selected: string
  onSelect: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className={cn(label, "text-muted-foreground")}>Layers</span>
      <ToggleGroup
        aria-label="Layers"
        orientation="vertical"
        value={[selected]}
        onValueChange={(value) => value[0] && setSelected(value[0])}
        className={cn("flex flex-col bg-background", ink)}
      >
        {layers.map((layer) => (
          <Toggle
            key={layer.value}
            value={layer.value}
            className={cn(
              "flex h-8 cursor-default items-center gap-2 px-2.5 text-[13px] select-none hover:bg-foreground/[0.06] data-pressed:bg-foreground data-pressed:text-background [&_svg]:size-3.5",
              ring,
            )}
          >
            <layer.icon aria-hidden="true" />
            {layer.label}
          </Toggle>
        ))}
      </ToggleGroup>
    </div>
  )
})

const CanvasStyle = React.memo(function CanvasStyle({
  selected,
  fill,
  opacity,
  setFill,
  setOpacity,
}: {
  selected: string
  fill: Record<string, string>
  opacity: Record<string, number>
  setFill: React.Dispatch<React.SetStateAction<Record<string, string>>>
  setOpacity: React.Dispatch<React.SetStateAction<Record<string, number>>>
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className={cn(label, "text-muted-foreground")}>Fill</span>
        <ToggleGroup
          aria-label="Fill"
          value={[fill[selected]]}
          onValueChange={(value) => value[0] && setFill((current) => ({ ...current, [selected]: value[0] }))}
          className="flex gap-1.5"
        >
          {fills.map((entry) => (
            <Toggle
              key={entry.value}
              value={entry.value}
              aria-label={entry.label}
              className={cn(
                "size-7 border border-foreground data-pressed:outline-2 data-pressed:outline-offset-2 data-pressed:outline-foreground",
                entry.className,
                ring,
              )}
            />
          ))}
        </ToggleGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className={cn(label, "flex justify-between text-muted-foreground tabular-nums")}>
          Opacity <span>{opacity[selected]}%</span>
        </span>
        <Slider
          value={opacity[selected]}
          onValueChange={(value) => setOpacity((current) => ({ ...current, [selected]: value as number }))}
          min={10}
          max={100}
        >
          <SliderControl className="flex h-5 items-center">
            <SliderTrack className="relative h-px w-full bg-foreground/25">
              <SliderIndicator className="h-0.5 -translate-y-[0.5px] bg-foreground" />
              <SliderThumb aria-label="Opacity" className={cn("size-3.5 bg-background", ink, ring)} />
            </SliderTrack>
          </SliderControl>
        </Slider>
      </div>
    </>
  )
})

function CanvasTile({ className, fig }: { className?: string; fig?: string }) {
  const [ref, scale] = useFit(460)
  const [selected, setSelected] = React.useState("circle")
  const [fill, setFill] = React.useState<Record<string, string>>({
    frame: "hatch",
    circle: "ink",
    text: "white",
  })
  const [opacity, setOpacity] = React.useState<Record<string, number>>({ frame: 100, circle: 100, text: 100 })
  const [boxes, setBoxes] = React.useState(shapes)
  return (
    <Poster
      fig={fig}
      head={"A SMALL DESIGN TOOL\nDRAG, RESIZE, CHANGE COLORS"}
      pattern="dots"
      body="justify-between gap-8"
      className={className}
    >
      <Title id="canvas" max={6.5} className="-ms-[0.05em]">
        Canvas.
      </Title>
      <Board
        boxes={boxes}
        onBoxesChange={setBoxes}
        defaultBoxes={shapes}
        width={460}
        height={312}
        scale={scale}
        step={4}
      >
        {({ boxes: live }) => {
          const box = live[selected]
          return (
            <div className="grid gap-4 @[40rem]:grid-cols-[1fr_11rem]">
              <div ref={ref} className={cn("relative bg-background", ink)} style={{ height: 312 * scale }}>
                <div
                  className="absolute start-0 top-0 h-[312px] w-[460px] origin-top-left rtl:origin-top-right"
                  style={{ transform: `scale(${scale})` }}
                >
                  {layers.map((layer) => (
                    <Shape
                      key={layer.value}
                      layer={layer}
                      selected={selected === layer.value}
                      fill={fill[layer.value]}
                      opacity={opacity[layer.value]}
                      onSelect={setSelected}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <CanvasLayers selected={selected} onSelect={setSelected} />
                <div className="grid grid-cols-4 gap-px border border-foreground bg-foreground font-mono text-[11px] tabular-nums @[40rem]:grid-cols-2">
                  {(["x", "y", "width", "height"] as const).map((key) => (
                    <NumberInput
                      key={key}
                      value={box ? Math.round(box[key]) : 0}
                      min={key === "width" || key === "height" ? 40 : 0}
                      max={key === "x" || key === "width" ? 460 : 312}
                      onValueChange={(value) =>
                        value !== null &&
                        setBoxes((current) => ({
                          ...current,
                          [selected]: { ...current[selected], [key]: value },
                        }))
                      }
                      className="flex items-center gap-1 bg-background has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:-outline-offset-2 has-focus-visible:outline-[#006bff]"
                    >
                      <NumberInputScrubArea
                        pixelsPerStep={2}
                        className="flex h-full cursor-ew-resize items-center self-stretch ps-2 pe-1 text-muted-foreground uppercase select-none hover:text-foreground"
                      >
                        {key[0]}
                        <NumberInputScrubAreaCursor className="text-foreground">
                          <MoveHorizontalIcon aria-hidden="true" className="size-4" />
                        </NumberInputScrubAreaCursor>
                      </NumberInputScrubArea>
                      <NumberInputControl
                        aria-label={key}
                        className="h-8 w-full min-w-0 bg-transparent pe-2 text-end outline-none focus-visible:bg-foreground/[0.06] pointer-coarse:text-base"
                      />
                    </NumberInput>
                  ))}
                </div>
                <CanvasStyle
                  selected={selected}
                  fill={fill}
                  opacity={opacity}
                  setFill={setFill}
                  setOpacity={setOpacity}
                />
              </div>
            </div>
          )
        }}
      </Board>
    </Poster>
  )
}

const channels = [
  { value: "kick", label: "Kick", level: 78 },
  { value: "snare", label: "Snare", level: 64 },
  { value: "bass", label: "Bass", level: 70 },
  { value: "keys", label: "Keys", level: 52 },
  { value: "vox", label: "Vox", level: 84 },
]

function decibels(level: number) {
  if (level <= 0) return "−∞"
  const db = 20 * Math.log10(level / 80)
  return `${db >= 0 ? "+" : "−"}${Math.abs(db).toFixed(1)}`
}

function Fader({
  label: name,
  value,
  onValueChange,
  wide = false,
}: {
  label: string
  value: number
  onValueChange: (value: number) => void
  wide?: boolean
}) {
  return (
    <Slider
      orientation="vertical"
      value={value}
      onValueChange={(next) => onValueChange(next as number)}
      className="flex h-40 justify-center"
    >
      <SliderControl className="relative flex h-full w-8 justify-center">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 start-0 flex flex-col justify-between font-mono text-[8px] leading-none text-muted-foreground"
        >
          {[0, 1, 2, 3, 4].map((tick) => (
            <span key={tick} className={cn("h-px bg-foreground/40", tick % 2 ? "w-1.5" : "w-2.5")} />
          ))}
        </div>
        <SliderTrack className="relative h-full w-px bg-foreground/25">
          <SliderIndicator className="w-0.5 -translate-x-[0.5px] bg-foreground" />
          <SliderThumb
            aria-label={`${name} level`}
            className={cn("h-3 bg-background data-dragging:bg-foreground", wide ? "w-7" : "w-5", ink, ring)}
          />
        </SliderTrack>
      </SliderControl>
    </Slider>
  )
}

function MixerTile({ className, fig }: { className?: string; fig?: string }) {
  const [levels, setLevels] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(channels.map((channel) => [channel.value, channel.level])),
  )
  const [master, setMaster] = React.useState(80)
  const [muted, setMuted] = React.useState<string[]>(["keys"])
  const [solo, setSolo] = React.useState<string[]>([])
  const [playing, setPlaying] = React.useState(true)
  const meters = React.useRef<Record<string, HTMLSpanElement | null>>({})
  const audible = (channel: string) =>
    !muted.includes(channel) && (solo.length === 0 || solo.includes(channel))
  const state = React.useRef({ levels, master, audible, playing })
  state.current = { levels, master, audible, playing }
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    let tick = 0
    const loop = () => {
      tick += 1
      const now = state.current
      let sum = 0
      for (const channel of channels) {
        const beat = channel.value === "kick" ? Math.max(0, Math.sin(tick / 6)) : Math.random()
        const level = now.playing && now.audible(channel.value) ? now.levels[channel.value] : 0
        const value = level * (0.55 + 0.45 * beat) * (now.master / 80)
        sum += value
        const meter = meters.current[channel.value]
        if (meter) meter.style.scale = `1 ${Math.min(1, value / 100)}`
      }
      const out = meters.current.master
      if (out) out.style.scale = `1 ${Math.min(1, sum / channels.length / 70)}`
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])
  const meter = (key: string) => (
    <span
      aria-hidden="true"
      className="relative h-40 w-1.5 overflow-hidden border border-foreground/30 bg-[repeating-linear-gradient(to_bottom,transparent_0_3px,var(--poster)_3px_4px)]"
    >
      <span
        ref={(element) => {
          meters.current[key] = element
        }}
        className="absolute inset-0 origin-bottom bg-foreground [scale:1_0]"
      />
    </span>
  )
  return (
    <Poster
      fig={fig}
      head={"FIVE CHANNELS\nDRAG A FADER, MUTE, SOLO\nARROWS FOR FINE STEPS"}
      pattern="rules"
      body="justify-between gap-8"
      className={className}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
        <Title id="mixer" max={6.5} className="-ms-[0.05em]">
          Mixer.
        </Title>
        <div className="flex items-baseline gap-2">
          <Numeral className="text-[length:clamp(2rem,6cqi,3.5rem)]">{decibels(master)}</Numeral>
          <span className={cn(label, "text-muted-foreground")}>dB master</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Toggle
            aria-label={playing ? "Stop" : "Play"}
            pressed={playing}
            onPressedChange={setPlaying}
            className={press}
          >
            {playing ? <PauseIcon aria-hidden="true" /> : <PlayIcon aria-hidden="true" />}
          </Toggle>
          <span className={cn(label, "text-muted-foreground")}>
            {playing ? "Playing · 124 BPM" : "Stopped"}
          </span>
        </div>
        <div>
          <div className={cn("flex divide-x divide-foreground/20 bg-background", ink)}>
            {channels.map((channel) => (
              <div
                key={channel.value}
                className="flex min-w-0 flex-1 flex-col items-center gap-3 px-1 py-3 @[30rem]:px-2"
              >
                <span className={label}>{channel.label}</span>
                <div className="flex items-end gap-1 @[30rem]:gap-2">
                  <Fader
                    label={channel.label}
                    value={levels[channel.value]}
                    onValueChange={(value) =>
                      setLevels((current) => ({ ...current, [channel.value]: value }))
                    }
                  />
                  {meter(channel.value)}
                </div>
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {decibels(levels[channel.value])}
                </span>
                <div className="flex flex-col gap-1 @[30rem]:flex-row">
                  <Toggle
                    aria-label={`Mute ${channel.label}`}
                    pressed={muted.includes(channel.value)}
                    onPressedChange={(pressed) =>
                      setMuted((current) =>
                        pressed
                          ? [...current, channel.value]
                          : current.filter((value) => value !== channel.value),
                      )
                    }
                    className={press}
                  >
                    M
                  </Toggle>
                  <Toggle
                    aria-label={`Solo ${channel.label}`}
                    pressed={solo.includes(channel.value)}
                    onPressedChange={(pressed) =>
                      setSolo((current) =>
                        pressed
                          ? [...current, channel.value]
                          : current.filter((value) => value !== channel.value),
                      )
                    }
                    className={press}
                  >
                    S
                  </Toggle>
                </div>
              </div>
            ))}
            <div className="flex min-w-0 flex-1 flex-col items-center gap-3 bg-foreground/[0.04] px-1 py-3 @[30rem]:px-2">
              <span className={label}>Master</span>
              <div className="flex items-end gap-1 @[30rem]:gap-2">
                <Fader label="Master" value={master} onValueChange={setMaster} wide />
                {meter("master")}
              </div>
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                {decibels(master)}
              </span>
              <span className="flex h-7 items-center">
                {muted.length + solo.length > 0 ? (
                  <VolumeXIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
                ) : (
                  <Volume2Icon aria-hidden="true" className="size-3.5" />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between gap-6">
        <Pill name="slider" />
      </div>
    </Poster>
  )
}

type Clip = Span & { title: string }
type ReelState = { clips: Clip[]; draft: SpansDraft<Clip> | null }
type ReelOptions = { defaultClips: Clip[] }

const fps = 24
const length = 20 * fps

function timecode(frame: number) {
  const seconds = Math.floor(frame / fps)
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}:${String(Math.round(frame % fps)).padStart(2, "0")}`
}

const reel = definePrimitive({
  name: "reel",
  options: { defaultClips: "value" },
  state: (options: ReelOptions): ReelState => ({ clips: options.defaultClips, draft: null }),
  api: (context) => {
    const change = createChange(context)
    return {
      spans: createSpans<ReelState, Clip>(context, {
        key: "clips",
        draft: "draft",
        set: (value, details) => change("clips", value, details),
        axis: "x",
        min: () => 0,
        max: () => length,
        step: () => fps / 4,
        overlap: false,
        label: (clip) => `${clip.title}, ${timecode(clip.start)} to ${timecode(clip.end)}`,
        createAutoScroll: false,
      }),
    }
  },
  slots: (slot) => ({
    root: slot<{}, { clips: Clip[] }>({
      state: (state, { api }) => ({ clips: api.spans.spans(state) }),
    }),
    track: slot<{ value: string }>({
      props: { value: "string" },
      attrs: () => ({ role: "group", style: "position:relative;touch-action:none;user-select:none" }),
      bind: (el, { api, key }) => {
        const unbind = api.spans.bindTrack(el, key)
        const view = el.ownerDocument.defaultView!
        view.addEventListener("blur", api.spans.cancel)
        return () => {
          unbind()
          view.removeEventListener("blur", api.spans.cancel)
        }
      },
    }),
    clip: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, { api, key }) => {
        const clip = api.spans.spans(state).find((other) => other.id === key)
        return {
          tabindex: "0",
          "aria-label": clip ? `${clip.title}, ${timecode(clip.start)} to ${timecode(clip.end)}` : undefined,
          ...api.spans.spanAttrs(state, key),
          style: clip ? api.spans.spanStyle(clip) : undefined,
        }
      },
      on: {
        pointerdown: (event, { api, key }) => api.spans.spanPointerdown(event, key),
        keydown: (event, { api, key }) => api.spans.keydown(event, key),
      },
      bind: (el, { api, key }) => api.spans.bindSpan(el, key),
    }),
  }),
})

const reelParts = createParts(reel, { root: "div", track: "div", clip: "div" })
const Reel = reelParts.Root
const ReelTrack = reelParts.Track
const ReelClip = reelParts.Clip

const clips: Clip[] = [
  { id: "open", track: "v1", start: 0, end: 6 * fps, title: "Open" },
  { id: "street", track: "v1", start: 6 * fps, end: 13 * fps, title: "Street" },
  { id: "close", track: "v1", start: 14 * fps, end: 20 * fps, title: "Close" },
  { id: "title", track: "v2", start: 1 * fps, end: 5 * fps, title: "Title card" },
  { id: "lower", track: "v2", start: 9 * fps, end: 12 * fps, title: "Lower third" },
  { id: "score", track: "a1", start: 0, end: 16 * fps, title: "Score" },
  { id: "voice", track: "a2", start: 3 * fps, end: 11 * fps, title: "Voice" },
]
const tracks = [
  { value: "v2", label: "V2" },
  { value: "v1", label: "V1" },
  { value: "a1", label: "A1" },
  { value: "a2", label: "A2" },
]

function wave(id: string) {
  let seed = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return Array.from({ length: 48 }, () => {
    seed = (seed * 9301 + 49297) % 233280
    return 20 + (seed / 233280) * 70
  })
}

function TimelineTile({ className, fig }: { className?: string; fig?: string }) {
  const [frame, setFrame] = React.useState(5 * fps)
  const [playing, setPlaying] = React.useState(false)
  const [hidden, setHidden] = React.useState<string[]>([])
  React.useEffect(() => {
    if (!playing) return
    let last = performance.now()
    let id = 0
    const loop = (now: number) => {
      setFrame((current) => (current + ((now - last) / 1000) * fps) % length)
      last = now
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [playing])
  return (
    <Poster
      fig={fig}
      head={"A VIDEO TIMELINE\nDRAG CLIPS, TRIM THE ENDS\nSCRUB TO WATCH"}
      tone="white"
      pattern="ruler"
      body="justify-between gap-8"
      className={className}
    >
      <Reel defaultClips={clips}>
        {({ clips: live }) => {
          const at = (track: string) =>
            hidden.includes(track)
              ? undefined
              : live.find((clip) => clip.track === track && clip.start <= frame && frame < clip.end)
          const shot = at("v1")
          const overlay = at("v2")
          return (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
                <Title id="timeline" max={6.5} className="-ms-[0.05em]">
                  Timeline.
                </Title>
                <Numeral className="text-[length:clamp(2rem,6cqi,3.5rem)]">{timecode(frame)}</Numeral>
              </div>
              <div className="flex flex-col gap-4">
                <div
                  className={cn(
                    "relative flex aspect-video items-center justify-center overflow-hidden @[36rem]:aspect-[2.4/1]",
                    ink,
                    shot ? "bg-foreground text-background" : "bg-background",
                  )}
                >
                  {shot ? (
                    <span className="text-[length:clamp(2rem,8cqi,4.5rem)] font-[450] tracking-[-0.05em]">
                      {shot.title}.
                    </span>
                  ) : (
                    <span className={cn(label, "text-muted-foreground")}>No signal</span>
                  )}
                  {overlay && (
                    <span className="absolute start-3 bottom-3 border border-current px-2 py-1 font-mono text-[10px] tracking-[0.06em] uppercase">
                      {overlay.title}
                    </span>
                  )}
                  <span className="absolute end-3 top-3 font-mono text-[10px] tabular-nums opacity-70">
                    {timecode(frame)}
                  </span>
                  <span className="pointer-events-none absolute inset-3 border border-current opacity-20" />
                </div>
                <div className={cn("flex min-w-0 flex-col bg-background", ink)}>
                  <div className="flex items-center gap-1.5 border-b border-foreground p-2">
                    <button
                      type="button"
                      aria-label="Back to start"
                      onClick={() => setFrame(0)}
                      className={press}
                    >
                      <SkipBackIcon aria-hidden="true" />
                    </button>
                    <Toggle
                      aria-label={playing ? "Pause" : "Play"}
                      pressed={playing}
                      onPressedChange={setPlaying}
                      className={press}
                    >
                      {playing ? <PauseIcon aria-hidden="true" /> : <PlayIcon aria-hidden="true" />}
                    </Toggle>
                    <span className={cn(label, "ms-auto text-muted-foreground tabular-nums")}>
                      {live.length} clips · 24 fps
                    </span>
                  </div>
                  <div className="grid grid-cols-[2.75rem_minmax(0,1fr)]">
                    <div className="border-e border-foreground/20" />
                    <Slider
                      value={Math.round(frame)}
                      onValueChange={(value) => setFrame(value as number)}
                      format={timecode}
                      min={0}
                      max={length - 1}
                      step={1}
                      className="relative"
                    >
                      <SliderControl className="relative flex h-8 items-end border-b border-foreground/20">
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 flex h-full justify-between font-mono text-[9px] text-muted-foreground"
                        >
                          {Array.from({ length: 11 }, (_, index) => (
                            <span key={index} className="flex w-0 flex-col items-center justify-end gap-0.5">
                              {index % 2 === 0 && index < 10 && <span>{index * 2}s</span>}
                              <span className={cn("w-px bg-foreground/40", index % 2 ? "h-1.5" : "h-2.5")} />
                            </span>
                          ))}
                        </div>
                        <SliderTrack className="relative h-full w-full">
                          <SliderThumb
                            aria-label="Playhead"
                            className={cn(
                              "top-auto! bottom-0 h-3 w-2.5 translate-y-0! bg-foreground [clip-path:polygon(0_0,100%_0,100%_60%,50%_100%,0_60%)]",
                              ring,
                            )}
                          />
                        </SliderTrack>
                      </SliderControl>
                    </Slider>
                  </div>
                  <div className="relative">
                    {tracks.map((track) => (
                      <div
                        key={track.value}
                        className="grid grid-cols-[2.75rem_minmax(0,1fr)] border-b border-foreground/15 last:border-b-0"
                      >
                        <Toggle
                          aria-label={`Hide ${track.label}`}
                          pressed={hidden.includes(track.value)}
                          onPressedChange={(pressed) =>
                            setHidden((current) =>
                              pressed
                                ? [...current, track.value]
                                : current.filter((value) => value !== track.value),
                            )
                          }
                          className={cn(
                            "border-e border-foreground/20 font-mono text-[10px] select-none hover:bg-foreground/[0.06] data-pressed:text-muted-foreground data-pressed:line-through",
                            ring,
                          )}
                        >
                          {track.label}
                        </Toggle>
                        <ReelTrack
                          value={track.value}
                          aria-label={track.label}
                          className="h-12 @[44rem]:h-16"
                        >
                          {live
                            .filter((clip) => clip.track === track.value)
                            .map((clip) => (
                              <ReelClip
                                key={clip.id}
                                value={clip.id}
                                className={cn(
                                  "inset-y-1 flex cursor-grab items-center overflow-hidden border border-foreground px-1.5 font-mono text-[10px] whitespace-nowrap outline-none select-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-[#006bff] data-dragging:cursor-grabbing",
                                  track.value.startsWith("v")
                                    ? "bg-foreground text-background"
                                    : "bg-background",
                                  hidden.includes(track.value) && "opacity-40",
                                )}
                              >
                                {track.value.startsWith("a") && (
                                  <span
                                    aria-hidden="true"
                                    className="absolute inset-x-0 inset-y-1 flex items-center gap-px opacity-30"
                                  >
                                    {wave(clip.id).map((height, index) => (
                                      <span
                                        key={index}
                                        className="flex-1 bg-foreground"
                                        style={{ height: `${height}%` }}
                                      />
                                    ))}
                                  </span>
                                )}
                                <span
                                  className="relative min-w-0 truncate bg-inherit px-0.5"
                                  title={clip.title}
                                >
                                  {clip.title}
                                </span>
                              </ReelClip>
                            ))}
                        </ReelTrack>
                      </div>
                    ))}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 w-px bg-foreground"
                      style={{
                        insetInlineStart: `calc(2.75rem + (100% - 2.75rem) * ${frame / (length - 1)})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )
        }}
      </Reel>
    </Poster>
  )
}

const voices = [
  { value: "kick", label: "Kick", steps: [0, 4, 8, 12, 14] },
  { value: "snare", label: "Snare", steps: [4, 12] },
  { value: "hat", label: "Hat", steps: [2, 6, 10, 14, 15] },
  { value: "clap", label: "Clap", steps: [12] },
]

function hit(audio: AudioContext, voice: string, volume: number) {
  const now = audio.currentTime
  const gain = audio.createGain()
  gain.connect(audio.destination)
  if (voice === "kick") {
    const osc = audio.createOscillator()
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.18)
    gain.gain.setValueAtTime(0.9 * volume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.3)
    return
  }
  const length = voice === "hat" ? 0.05 : voice === "clap" ? 0.18 : 0.14
  const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * length), audio.sampleRate)
  const data = buffer.getChannelData(0)
  for (let index = 0; index < data.length; index++) data[index] = Math.random() * 2 - 1
  const noise = audio.createBufferSource()
  noise.buffer = buffer
  const filter = audio.createBiquadFilter()
  filter.type = voice === "hat" ? "highpass" : "bandpass"
  filter.frequency.value = voice === "hat" ? 7000 : voice === "clap" ? 1500 : 1800
  gain.gain.setValueAtTime((voice === "hat" ? 0.25 : 0.5) * volume, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + length)
  noise.connect(filter)
  filter.connect(gain)
  noise.start(now)
}

function SequencerTile({ className, fig }: { className?: string; fig?: string }) {
  const [pattern, setPattern] = React.useState<Record<string, string[]>>(() =>
    Object.fromEntries(voices.map((voice) => [voice.value, voice.steps.map(String)])),
  )
  const [playing, setPlaying] = React.useState(false)
  const [tempo, setTempo] = React.useState(118)
  const [volume, setVolume] = React.useState(60)
  const [current, setCurrent] = React.useState(-1)
  const audio = React.useRef<AudioContext | null>(null)
  const latest = React.useRef({ pattern, volume })
  latest.current = { pattern, volume }
  React.useEffect(() => {
    if (!playing) {
      setCurrent(-1)
      return
    }
    audio.current ??= new AudioContext()
    void audio.current.resume()
    let step = 0
    const tick = () => {
      setCurrent(step)
      for (const voice of voices)
        if (latest.current.pattern[voice.value].includes(String(step)))
          hit(audio.current!, voice.value, latest.current.volume / 100)
      step = (step + 1) % 16
    }
    tick()
    const id = window.setInterval(tick, 60000 / tempo / 4)
    return () => window.clearInterval(id)
  }, [playing, tempo])
  return (
    <Poster
      fig={fig}
      head={"FOUR VOICES, SIXTEEN STEPS\nCLICK A STEP, ARROWS TO MOVE\nPRESS PLAY. IT MAKES SOUND."}
      tone="white"
      pattern="plus"
      body="justify-between gap-8"
      className={className}
    >
      <Title id="sequencer" max={6.5} className="-ms-[0.05em]">
        Sequencer.
      </Title>
      <div className={cn("flex flex-col bg-background", ink)}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-foreground p-2">
          <Toggle
            aria-label={playing ? "Stop" : "Play"}
            pressed={playing}
            onPressedChange={setPlaying}
            className={press}
          >
            {playing ? <PauseIcon aria-hidden="true" /> : <PlayIcon aria-hidden="true" />}
          </Toggle>
          <div className="flex min-w-36 flex-1 items-center gap-3">
            <span className={cn(label, "w-16 text-muted-foreground tabular-nums")}>{tempo} bpm</span>
            <Slider
              value={tempo}
              onValueChange={(value) => setTempo(value as number)}
              min={70}
              max={170}
              className="flex-1"
            >
              <SliderControl className="flex h-6 items-center">
                <SliderTrack className="relative h-px w-full bg-foreground/25">
                  <SliderIndicator className="h-0.5 -translate-y-[0.5px] bg-foreground" />
                  <SliderThumb aria-label="Tempo" className={cn("size-3.5 bg-background", ink, ring)} />
                </SliderTrack>
              </SliderControl>
            </Slider>
          </div>
          <div className="flex min-w-32 flex-1 items-center gap-3">
            <span className={cn(label, "w-12 text-muted-foreground tabular-nums")}>Vol {volume}</span>
            <Slider value={volume} onValueChange={(value) => setVolume(value as number)} className="flex-1">
              <SliderControl className="flex h-6 items-center">
                <SliderTrack className="relative h-px w-full bg-foreground/25">
                  <SliderIndicator className="h-0.5 -translate-y-[0.5px] bg-foreground" />
                  <SliderThumb aria-label="Volume" className={cn("size-3.5 bg-background", ink, ring)} />
                </SliderTrack>
              </SliderControl>
            </Slider>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 p-2">
          {voices.map((voice) => (
            <div key={voice.value} className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-2">
              <span className={label}>{voice.label}</span>
              <ToggleGroup
                aria-label={`${voice.label} steps`}
                multiple
                value={pattern[voice.value]}
                onValueChange={(value) => setPattern((current) => ({ ...current, [voice.value]: value }))}
                className="grid grid-cols-16 gap-0.5 @[36rem]:gap-1"
              >
                {Array.from({ length: 16 }, (_, step) => (
                  <Toggle
                    key={step}
                    value={String(step)}
                    aria-label={`Step ${step + 1}`}
                    data-beat={step % 4 === 0 ? "" : undefined}
                    data-current={current === step ? "" : undefined}
                    className={cn(
                      "aspect-square min-w-0 border border-foreground/40 bg-background transition-colors hover:border-foreground data-beat:border-foreground data-current:bg-foreground/15 data-pressed:border-foreground data-pressed:bg-foreground data-current:data-pressed:bg-foreground/60",
                      ring,
                    )}
                  />
                ))}
              </ToggleGroup>
            </div>
          ))}
          <div aria-hidden="true" className="grid grid-cols-[3rem_minmax(0,1fr)] gap-2">
            <span />
            <div className="grid grid-cols-16 gap-0.5 font-mono text-[9px] text-muted-foreground @[36rem]:gap-1">
              {Array.from({ length: 16 }, (_, step) => (
                <span key={step} className={cn("text-center", current === step && "text-foreground")}>
                  {step % 4 === 0 ? step / 4 + 1 : "·"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between gap-6">
        <Pill name="toggle" />
        <span className={cn(label, "text-muted-foreground")}>
          Step {current < 0 ? "–" : current + 1} / 16
        </span>
      </div>
    </Poster>
  )
}

const facade = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640"><defs><pattern id="w" width="48" height="40" patternUnits="userSpaceOnUse"><rect width="48" height="40" fill="#2b2b2b"/><rect x="6" y="6" width="36" height="26" fill="#8a8a8a"/><rect x="6" y="6" width="36" height="8" fill="#b5b5b5"/></pattern><pattern id="v" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#d9d9d9"/><rect width="2" height="22" fill="#9a9a9a"/></pattern><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f2f2"/><stop offset="1" stop-color="#cfcfcf"/></linearGradient></defs><rect width="960" height="640" fill="url(#s)"/><circle cx="760" cy="140" r="70" fill="#fff"/><rect x="80" y="150" width="360" height="490" fill="url(#w)"/><rect x="80" y="130" width="360" height="20" fill="#111"/><rect x="460" y="260" width="250" height="380" fill="url(#v)"/><rect x="460" y="240" width="250" height="20" fill="#1a1a1a"/><rect x="730" y="330" width="230" height="310" fill="#3a3a3a"/><rect x="760" y="360" width="170" height="16" fill="#777"/><rect x="760" y="400" width="170" height="16" fill="#777"/><rect x="760" y="440" width="170" height="16" fill="#777"/><rect x="0" y="590" width="960" height="50" fill="#111"/><rect x="0" y="584" width="960" height="6" fill="#555"/></svg>`,
)}`
const crops = [
  { value: "free", label: "Free", ratio: undefined },
  { value: "square", label: "1:1", ratio: 1 },
  { value: "portrait", label: "4:5", ratio: 4 / 5 },
  { value: "wide", label: "16:9", ratio: 16 / 9 },
]
const sides = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const

function EditorTile({ className, fig }: { className?: string; fig?: string }) {
  const [ratio, setRatio] = React.useState("portrait")
  const [crop, setCrop] = React.useState<ImageCrop>()
  const [contrast, setContrast] = React.useState(110)
  const [exposure, setExposure] = React.useState(100)
  const [result, setResult] = React.useState<string>()
  React.useEffect(
    () => () => {
      if (result) URL.revokeObjectURL(result)
    },
    [result],
  )
  const filter = `grayscale(1) contrast(${contrast}%) brightness(${exposure}%)`
  const adjust = (name: string, value: number, set: (value: number) => void) => (
    <div className="flex flex-col gap-2">
      <span className={cn(label, "flex justify-between text-muted-foreground tabular-nums")}>
        {name} <span>{value}%</span>
      </span>
      <Slider value={value} onValueChange={(next) => set(next as number)} min={50} max={160}>
        <SliderControl className="flex h-5 items-center">
          <SliderTrack className="relative h-px w-full bg-foreground/25">
            <SliderIndicator className="h-0.5 -translate-y-[0.5px] bg-foreground" />
            <SliderThumb aria-label={name} className={cn("size-3.5 bg-background", ink, ring)} />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  )
  return (
    <Poster
      fig={fig}
      head={"A PHOTO EDITOR\nDRAG THE CROP, PULL ITS EDGES\nROTATE, FLIP, ADJUST, EXPORT"}
      pattern="crosshatch"
      body="justify-between gap-8"
      className={className}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <div className="flex items-baseline gap-2">
          <Numeral className="-ms-[0.06em] text-[length:clamp(2rem,6cqi,3.5rem)]">
            {crop ? `${Math.round(crop.width)}×${Math.round(crop.height)}` : "–"}
          </Numeral>
          <span className={cn(label, "text-muted-foreground")}>px</span>
        </div>
        <Title id="crop" max={6.5} className="-me-[0.04em]">
          Crop.
        </Title>
      </div>
      <ImageCropper
        aria-label="Photo"
        src={facade}
        aspectRatio={crops.find((item) => item.value === ratio)?.ratio}
        minWidth={48}
        minHeight={48}
        crop={crop}
        onCropChange={setCrop}
        className="grid gap-4 @[40rem]:grid-cols-[minmax(0,1fr)_12rem]"
      >
        <ImageCropperViewport
          className={cn("relative aspect-[3/2] w-full overflow-hidden bg-background", ink)}
        >
          <ImageCropperImage
            alt="A concrete building against a pale sky"
            className="block size-full object-contain"
            style={{ filter }}
          />
          <ImageCropperSelection className="outline-1 outline-white shadow-[0_0_0_100vmax_rgb(0_0_0/0.55)] focus-visible:outline-3">
            <ImageCropperGrid className="bg-[linear-gradient(to_right,transparent_calc(100%/3-0.5px),rgb(255_255_255/0.6)_0_calc(100%/3+0.5px),transparent_0_calc(200%/3-0.5px),rgb(255_255_255/0.6)_0_calc(200%/3+0.5px),transparent_0),linear-gradient(to_bottom,transparent_calc(100%/3-0.5px),rgb(255_255_255/0.6)_0_calc(100%/3+0.5px),transparent_0_calc(200%/3-0.5px),rgb(255_255_255/0.6)_0_calc(200%/3+0.5px),transparent_0)]" />
            {sides.map((side) => (
              <ImageCropperHandle
                key={side}
                position={side}
                className={cn(
                  "absolute size-2.5 -translate-1/2 border border-black bg-white after:absolute after:-inset-3",
                  side.includes("n") && "top-0",
                  side.includes("s") && "top-full",
                  side.includes("w") && "left-0",
                  side.includes("e") && "left-full",
                  (side === "n" || side === "s") && "left-1/2",
                  (side === "e" || side === "w") && "top-1/2",
                )}
              />
            ))}
          </ImageCropperSelection>
        </ImageCropperViewport>
        <div className="flex flex-col gap-4">
          <SegmentedControl
            aria-label="Aspect ratio"
            value={ratio}
            onValueChange={(value) => value && setRatio(value)}
            className={cn("relative grid grid-cols-4 bg-background", ink)}
          >
            <SegmentedControlIndicator className="absolute top-(--segmented-control-indicator-top) left-(--segmented-control-indicator-left) h-(--segmented-control-indicator-height) w-(--segmented-control-indicator-width) bg-foreground transition-[left,width] duration-200" />
            {crops.map((item) => (
              <SegmentedControlItem
                key={item.value}
                value={item.value}
                className={cn(
                  "relative h-8 font-mono text-[11px] text-muted-foreground transition-colors data-checked:text-background",
                  ring,
                )}
              >
                {item.label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
          <div className="flex gap-1.5">
            <ImageCropperRotate aria-label="Rotate" className={press}>
              <RotateCwIcon aria-hidden="true" />
            </ImageCropperRotate>
            <ImageCropperFlip aria-label="Flip horizontally" className={press}>
              <FlipHorizontal2Icon aria-hidden="true" />
            </ImageCropperFlip>
            <ImageCropperFlip direction="vertical" aria-label="Flip vertically" className={press}>
              <FlipVertical2Icon aria-hidden="true" />
            </ImageCropperFlip>
          </div>
          {adjust("Contrast", contrast, setContrast)}
          {adjust("Exposure", exposure, setExposure)}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                if (!crop) return
                const file = await cropImage(facade, crop)
                setResult(URL.createObjectURL(file))
              }}
              className={cn(press, "h-8 flex-1 bg-foreground text-background hover:bg-foreground/90")}
            >
              Export
            </button>
            <span
              className={cn(
                "flex size-12 shrink-0 items-center justify-center overflow-hidden bg-background",
                ink,
              )}
            >
              {result ? (
                <img src={result} alt="Your crop" className="max-h-full max-w-full" style={{ filter }} />
              ) : (
                <span className={cn(label, "text-muted-foreground")}>—</span>
              )}
            </span>
          </div>
        </div>
      </ImageCropper>
      <div className="flex items-end justify-between gap-6">
        <Pill name="image-cropper" />
      </div>
    </Poster>
  )
}

export {
  Board,
  BoardBox,
  BoardHandle,
  CanvasTile,
  EditorTile,
  MixerTile,
  PlanTile,
  SequencerTile,
  TimelineTile,
  useFit,
}
