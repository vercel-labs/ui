import * as React from "react"
import {
  createChange,
  createResize,
  definePrimitive,
  live,
  type ChangeDetails,
  type ResizeBox,
  type ResizeDraft,
  type ResizeHandle,
  type ResizeReason,
} from "@ui-sdk/core"
import { usePart, usePrimitive, type PartProps } from "@ui-sdk/react/primitive"

type FrameState = { boxes: Record<string, ResizeBox>; draft: ResizeDraft | null }

type FrameOptions = {
  defaultBox: ResizeBox
  onBoxesChange?: (boxes: Record<string, ResizeBox>, details: ChangeDetails<ResizeReason>) => void
}

const frame = definePrimitive({
  name: "frame",
  options: { defaultBox: "value", onBoxesChange: "callback" },
  state: (options: FrameOptions): FrameState => ({ boxes: { frame: options.defaultBox }, draft: null }),
  live: ["draft"],
  api: (context) => {
    const change = createChange(context)
    return {
      resize: createResize<FrameState>(context, {
        boxes: (state) => state.boxes,
        draft: "draft",
        set: (value, details) => change("boxes", value, details),
        min: () => ({ width: 60, height: 40 }),
        bounds: () => ({ left: 0, top: 0, right: 320, bottom: 200 }),
        step: () => 4,
      }),
    }
  },
  slots: (slot) => ({
    box: slot({
      attrs: (state, { api }) => ({ style: `${api.resize.boxStyle(state, "frame")};touch-action:none` }),
      live: live<FrameState, any, {}>((state, { api }) => ({ style: api.resize.style(state, "frame") })),
      on: { pointerdown: (event, { el, api }) => api.resize.pointerdown(event, "frame", "move", el!) },
    }),
    handle: slot<{ id: string; handle: ResizeHandle }>({
      props: { handle: "string" },
      attrs: (_state, { props, api }) => api.resize.handleAttrs(props.handle),
      on: {
        pointerdown: (event, { el, api, props }) => api.resize.pointerdown(event, "frame", props.handle, el!),
        keydown: (event, { api, props }) => api.resize.keydown(event, "frame", props.handle),
      },
    }),
  }),
})

function Frame({ defaultBox, onBoxesChange, ...props }: FrameOptions & PartProps<"div">) {
  const handle = usePrimitive(frame, { defaultBox, onBoxesChange })
  return usePart(handle, "box", {}, props, "div")
}

function FrameHandle({ handle, ...props }: { handle: ResizeHandle } & PartProps<"div">) {
  return usePart(frame, "handle", { id: handle, handle }, props, "div")
}

const places: Record<Exclude<ResizeHandle, "move">, string> = {
  nw: "-left-1.5 -top-1.5 cursor-nwse-resize",
  n: "left-1/2 -top-1.5 -translate-x-1/2 cursor-ns-resize",
  ne: "-right-1.5 -top-1.5 cursor-nesw-resize",
  e: "-right-1.5 top-1/2 -translate-y-1/2 cursor-ew-resize",
  se: "-right-1.5 -bottom-1.5 cursor-nwse-resize",
  s: "left-1/2 -bottom-1.5 -translate-x-1/2 cursor-ns-resize",
  sw: "-left-1.5 -bottom-1.5 cursor-nesw-resize",
  w: "-left-1.5 top-1/2 -translate-y-1/2 cursor-ew-resize",
}

function Example() {
  const [box, setBox] = React.useState({ x: 88, y: 48, width: 140, height: 92 })
  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-[200px] w-[320px] rounded-xl border border-border bg-muted/40">
        <Frame
          aria-label="Frame"
          defaultBox={box}
          onBoxesChange={(boxes) => setBox(boxes.frame)}
          className="cursor-move rounded-sm border-2 border-primary bg-primary/10"
        >
          {(Object.keys(places) as (keyof typeof places)[]).map((name) => (
            <FrameHandle
              key={name}
              handle={name}
              className={`absolute size-3 rounded-full border-2 border-primary bg-background outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${places[name]}`}
            />
          ))}
        </Frame>
      </div>
      <p className="text-xs text-muted-foreground tabular-nums">
        {box.width} × {box.height} at {box.x}, {box.y}
      </p>
    </div>
  )
}

export { Example, frame, Frame, FrameHandle, type FrameOptions, type FrameState }
