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
import { createParts } from "@ui-sdk/react/primitive"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/react/slider"
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"
import { cn } from "cn"
import {
  CircleIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SquareIcon,
  TypeIcon,
  MoveHorizontalIcon,
} from "lucide-react"
import * as React from "react"
import { Numeral, Title } from "./home-posters"

const ink = "border border-foreground"
const ring =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-blue has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-2 has-focus-visible:outline-blue"
const label = "font-mono text-[10px] tracking-[0.06em] uppercase"
const press = cn(
  "inline-flex h-7 min-w-7 shrink-0 cursor-default items-center justify-center gap-1.5 bg-background px-2 font-mono text-[10px] tracking-[0.06em] uppercase select-none hover:bg-foreground/[0.06] data-pressed:bg-foreground data-pressed:text-background [&_svg]:size-3.5",
  ink,
  ring
)

type BoardState = {
  boxes: Record<string, ResizeBox>
  draft: ResizeDraft | null
}

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
  sync: (options) =>
    options.boxes === undefined ? {} : { boxes: options.boxes },
  live: ["draft"],
  api: (context) => {
    const change = createChange(context)
    return {
      resize: createResize<BoardState>(context, {
        boxes: (state) => state.boxes,
        draft: "draft",
        set: (value, details) => change("boxes", value, details),
        min: () => ({
          width: context.options().min ?? 40,
          height: context.options().min ?? 40,
        }),
        bounds: () => ({
          left: 0,
          top: 0,
          right: context.options().width,
          bottom: context.options().height,
        }),
        step: () => context.options().step ?? 4,
        scale: () => context.options().scale ?? 1,
      }),
    }
  },
  slots: (slot) => ({
    root: slot<{}, { boxes: Record<string, ResizeBox>; active: string | null }>(
      {
        state: (state) => ({
          boxes:
            state.draft && state.draft.handle !== "move"
              ? { ...state.boxes, [state.draft.key]: state.draft.box }
              : state.boxes,
          active: state.draft?.key ?? null,
        }),
      }
    ),
    box: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, { api, key }) => ({
        role: "button",
        "aria-roledescription": "box",
        tabindex: "0",
        style: `${api.resize.boxStyle(state, key)};touch-action:none`,
      }),
      live: live<BoardState, any, { value: string }>((state, { api, key }) => ({
        "data-dragging": state.draft?.key === key ? "" : undefined,
        style: api.resize.style(state, key),
      })),
      on: {
        pointerdown: (event, { el, api, key }) =>
          api.resize.pointerdown(event, key, "move", el!),
        keydown: (event, { api, key }) =>
          api.resize.keydown(event, key, "move"),
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

const boardParts = createParts(board, {
  root: "div",
  box: "div",
  handle: "button",
})
const Board = boardParts.Root
const BoardBox = boardParts.Box
const BoardHandle = boardParts.Handle

function useFit(width: number) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)
  React.useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }
    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / width)
    )
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
        handle === "sw" && "-start-[5px] -bottom-[5px]"
      )}
    />
  ))
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
      aria-label={`${layer.value === "text" ? "Behaviors, text" : layer.label}. Arrow keys move it.`}
      onFocus={() => onSelect(layer.value)}
      className={cn(
        "group/box cursor-move outline-none",
        selected &&
          "z-10 outline-1 outline-offset-0 outline-foreground [outline-style:dashed]",
        "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-blue"
      )}
      style={{ opacity: opacity / 100 }}
    >
      {layer.value === "text" ? (
        <span
          className={cn(
            "flex size-full items-center px-3 text-[40px] leading-none font-[450] tracking-[-0.05em]",
            fill === "ink" && "bg-foreground text-background",
            fill === "gray" && "bg-foreground/15",
            fill === "hatch" && fills[3].className
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
            fills.find((entry) => entry.value === fill)?.className
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
              ring
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
          onValueChange={(value) =>
            value[0] &&
            setFill((current) => ({ ...current, [selected]: value[0] }))
          }
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
                ring
              )}
            />
          ))}
        </ToggleGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span
          className={cn(
            label,
            "flex justify-between text-muted-foreground tabular-nums"
          )}
        >
          Opacity <span>{opacity[selected]}%</span>
        </span>
        <Slider
          value={opacity[selected]}
          onValueChange={(value) =>
            setOpacity((current) => ({
              ...current,
              [selected]: value as number,
            }))
          }
          min={10}
          max={100}
        >
          <SliderControl className="flex h-5 items-center">
            <SliderTrack className="relative h-px w-full bg-foreground/25">
              <SliderIndicator className="h-0.5 -translate-y-[0.5px] bg-foreground" />
              <SliderThumb
                aria-label="Opacity"
                className={cn("size-3.5 bg-background", ink, ring)}
              />
            </SliderTrack>
          </SliderControl>
        </Slider>
      </div>
    </>
  )
})

function CanvasDemo() {
  const [ref, scale] = useFit(460)
  const [selected, setSelected] = React.useState("circle")
  const [fill, setFill] = React.useState<Record<string, string>>({
    frame: "hatch",
    circle: "ink",
    text: "white",
  })
  const [opacity, setOpacity] = React.useState<Record<string, number>>({
    frame: 100,
    circle: 100,
    text: 100,
  })
  const [boxes, setBoxes] = React.useState(shapes)
  return (
    <>
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
              <div
                ref={ref}
                className={cn("relative bg-background", ink)}
                style={{ height: 312 * scale }}
              >
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
                      className="flex items-center gap-1 bg-background has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:-outline-offset-2 has-focus-visible:outline-blue"
                    >
                      <NumberInputScrubArea
                        pixelsPerStep={2}
                        className="flex h-full cursor-ew-resize items-center self-stretch ps-2 pe-1 text-muted-foreground uppercase select-none hover:text-foreground"
                      >
                        {key[0]}
                        <NumberInputScrubAreaCursor className="text-foreground">
                          <MoveHorizontalIcon
                            aria-hidden="true"
                            className="size-4"
                          />
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
    </>
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
  state: (options: ReelOptions): ReelState => ({
    clips: options.defaultClips,
    draft: null,
  }),
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
        label: (clip) =>
          `${clip.title}, ${timecode(clip.start)} to ${timecode(clip.end)}`,
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
      attrs: () => ({
        role: "group",
        style: "position:relative;touch-action:none;user-select:none",
      }),
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
          "aria-label": clip
            ? `${clip.title}, ${timecode(clip.start)} to ${timecode(clip.end)}`
            : undefined,
          ...api.spans.spanAttrs(state, key),
          style: clip ? api.spans.spanStyle(clip) : undefined,
        }
      },
      on: {
        pointerdown: (event, { api, key }) =>
          api.spans.spanPointerdown(event, key),
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
  {
    id: "title",
    track: "v2",
    start: 1 * fps,
    end: 5 * fps,
    title: "Title card",
  },
  {
    id: "lower",
    track: "v2",
    start: 9 * fps,
    end: 12 * fps,
    title: "Lower third",
  },
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

function TimelineDemo() {
  const [frame, setFrame] = React.useState(5 * fps)
  const [playing, setPlaying] = React.useState(false)
  const [hidden, setHidden] = React.useState<string[]>([])
  React.useEffect(() => {
    if (!playing) {
      return
    }
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
    <>
      <Reel defaultClips={clips}>
        {({ clips: live }) => {
          const at = (track: string) =>
            hidden.includes(track)
              ? undefined
              : live.find(
                  (clip) =>
                    clip.track === track &&
                    clip.start <= frame &&
                    frame < clip.end
                )
          const shot = at("v1")
          const overlay = at("v2")
          return (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
                <Title id="timeline" max={6.5} className="-ms-[0.05em]">
                  Timeline.
                </Title>
                <Numeral className="text-[length:clamp(2rem,6cqi,3.5rem)]">
                  {timecode(frame)}
                </Numeral>
              </div>
              <div className="flex flex-col gap-4">
                <div
                  className={cn(
                    "relative flex aspect-video items-center justify-center overflow-hidden @[36rem]:aspect-[2.4/1]",
                    ink,
                    shot ? "bg-foreground text-background" : "bg-background"
                  )}
                >
                  {shot ? (
                    <span className="text-[length:clamp(2rem,8cqi,4.5rem)] font-[450] tracking-[-0.05em]">
                      {shot.title}.
                    </span>
                  ) : (
                    <span className={cn(label, "text-muted-foreground")}>
                      No signal
                    </span>
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
                      {playing ? (
                        <PauseIcon aria-hidden="true" />
                      ) : (
                        <PlayIcon aria-hidden="true" />
                      )}
                    </Toggle>
                    <span
                      className={cn(
                        label,
                        "ms-auto text-muted-foreground tabular-nums"
                      )}
                    >
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
                            <span
                              key={index}
                              className="flex w-0 flex-col items-center justify-end gap-0.5"
                            >
                              {index % 2 === 0 && index < 10 && (
                                <span>{index * 2}s</span>
                              )}
                              <span
                                className={cn(
                                  "w-px bg-foreground/40",
                                  index % 2 ? "h-1.5" : "h-2.5"
                                )}
                              />
                            </span>
                          ))}
                        </div>
                        <SliderTrack className="relative h-full w-full">
                          <SliderThumb
                            aria-label="Playhead"
                            className={cn(
                              "top-auto! bottom-0 h-3 w-2.5 translate-y-0! bg-foreground [clip-path:polygon(0_0,100%_0,100%_60%,50%_100%,0_60%)]",
                              ring
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
                                : current.filter(
                                    (value) => value !== track.value
                                  )
                            )
                          }
                          className={cn(
                            "border-e border-foreground/20 font-mono text-[10px] select-none hover:bg-foreground/[0.06] data-pressed:text-muted-foreground data-pressed:line-through",
                            ring
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
                                  "inset-y-1 flex cursor-grab items-center overflow-hidden border border-foreground px-1.5 font-mono text-[10px] whitespace-nowrap outline-none select-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-blue data-dragging:cursor-grabbing",
                                  track.value.startsWith("v")
                                    ? "bg-foreground text-background"
                                    : "bg-background",
                                  hidden.includes(track.value) && "opacity-40"
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
    </>
  )
}

export { Board, BoardBox, BoardHandle, CanvasDemo, TimelineDemo, useFit }
