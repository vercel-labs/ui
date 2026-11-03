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

const handles: Exclude<ResizeHandle, "move">[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"]

function Example() {
  const [box, setBox] = React.useState({ x: 88, y: 48, width: 140, height: 92 })
  return (
    <div data-slot="stack">
      <div data-slot="resize-stage">
        <Frame aria-label="Frame" defaultBox={box} onBoxesChange={(boxes) => setBox(boxes.frame)}>
          {handles.map((name) => (
            <FrameHandle key={name} handle={name} />
          ))}
        </Frame>
      </div>
      <p data-slot="output">
        {box.width} × {box.height} at {box.x}, {box.y}
      </p>
    </div>
  )
}

export { Example, frame, Frame, FrameHandle, type FrameOptions, type FrameState }
