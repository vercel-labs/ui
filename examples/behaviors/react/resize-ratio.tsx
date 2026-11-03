import * as React from "react"
import {
  createChange,
  createResize,
  definePrimitive,
  live,
  type ResizeBox,
  type ResizeDraft,
  type ResizeHandle,
} from "@ui-sdk/core"
import { usePart, usePrimitive, type PartProps } from "@ui-sdk/react/primitive"

type VideoState = { boxes: Record<string, ResizeBox>; locked: boolean; draft: ResizeDraft | null }

type VideoOptions = { locked?: boolean; onBoxesChange?: (boxes: Record<string, ResizeBox>) => void }

const video = definePrimitive({
  name: "video",
  options: { locked: "boolean", onBoxesChange: "callback" },
  state: (options: VideoOptions): VideoState => ({
    boxes: { video: { x: 40, y: 40, width: 160, height: 90 } },
    locked: options.locked ?? true,
    draft: null,
  }),
  sync: (options) => ({ locked: options.locked ?? true }),
  live: ["draft"],
  api: (context) => {
    const change = createChange(context)
    return {
      resize: createResize<VideoState>(context, {
        boxes: (state) => state.boxes,
        draft: "draft",
        set: (value, details) => change("boxes", value, details),
        aspect: () => (context.store.get().locked ? 16 / 9 : undefined),
        min: () => ({ width: 96, height: 54 }),
        max: () => ({ width: 256, height: 144 }),
        bounds: () => ({ left: 0, top: 0, right: 320, bottom: 200 }),
        largeStep: () => 16,
      }),
    }
  },
  slots: (slot) => ({
    box: slot({
      attrs: (state, { api }) => ({ style: `${api.resize.boxStyle(state, "video")};touch-action:none` }),
      live: live<VideoState, any, {}>((state, { api }) => ({ style: api.resize.style(state, "video") })),
      on: { pointerdown: (event, { el, api }) => api.resize.pointerdown(event, "video", "move", el!) },
    }),
    handle: slot<{ id: string; handle: ResizeHandle }>({
      props: { handle: "string" },
      attrs: (_state, { props, api }) => api.resize.handleAttrs(props.handle),
      on: {
        pointerdown: (event, { el, api, props }) => api.resize.pointerdown(event, "video", props.handle, el!),
        keydown: (event, { api, props }) => api.resize.keydown(event, "video", props.handle),
      },
    }),
  }),
})

function Video({ locked, onBoxesChange, ...props }: VideoOptions & PartProps<"div">) {
  const handle = usePrimitive(video, { locked, onBoxesChange })
  return usePart(handle, "box", {}, props, "div")
}

function VideoHandle({ handle, ...props }: { handle: ResizeHandle } & PartProps<"div">) {
  return usePart(video, "handle", { id: handle, handle }, props, "div")
}

const places: Partial<Record<ResizeHandle, string>> = {
  nw: "Top left",
  ne: "Top right",
  e: "Right",
  se: "Bottom right",
  sw: "Bottom left",
  w: "Left",
}

function Example() {
  const [locked, setLocked] = React.useState(true)
  const [box, setBox] = React.useState({ width: 160, height: 90 })
  return (
    <div data-slot="stack">
      <div data-slot="resize-stage">
        <Video aria-label="Video" locked={locked} onBoxesChange={(boxes) => setBox(boxes.video)}>
          ▶
          {(Object.keys(places) as ResizeHandle[]).map((name) => (
            <VideoHandle key={name} handle={name} aria-label={`${places[name]} handle`} tabIndex={0} />
          ))}
        </Video>
      </div>
      <div data-slot="row">
        <label data-slot="label">
          <input type="checkbox" checked={locked} onChange={(event) => setLocked(event.target.checked)} />
          Keep 16:9
        </label>
        <span data-slot="hint">
          {Math.round(box.width)} × {Math.round(box.height)}
        </span>
      </div>
    </div>
  )
}

export { Example, video, Video, VideoHandle, type VideoOptions, type VideoState }
