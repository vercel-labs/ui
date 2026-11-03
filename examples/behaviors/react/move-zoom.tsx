import * as React from "react"
import {
  createChange,
  createMove,
  css,
  definePrimitive,
  live,
  type MoveDraft,
  type MovePoint,
} from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"

type CanvasState = { positions: Record<string, MovePoint>; zoom: number; moving: MoveDraft | null }

type CanvasOptions = {
  zoom?: number
  onPositionsChange?: (positions: Record<string, MovePoint>) => void
}

const canvas = definePrimitive({
  name: "canvas",
  options: { zoom: "number", onPositionsChange: "callback" },
  state: (options: CanvasOptions): CanvasState => ({
    positions: { circle: { x: 40, y: 40 }, square: { x: 160, y: 80 } },
    zoom: options.zoom ?? 1,
    moving: null,
  }),
  sync: (options) => ({ zoom: options.zoom ?? 1 }),
  live: ["moving"],
  api: (context) => {
    const change = createChange(context)
    const move = createMove<CanvasState>(context, {
      key: "positions",
      draft: "moving",
      set: (value, details) => change("positions", value, details),
      scale: () => context.store.get().zoom,
    })
    return {
      move,
      act(action: string) {
        if (action === "center") move.moveTo("circle", { x: 100, y: 60 })
        else if (action === "nudge") move.moveBy(["circle"], 10, 0)
      },
    }
  },
  slots: (slot) => ({
    root: slot({ attrs: () => ({ role: "group" }) }),
    surface: slot({
      attrs: (state) => ({
        style: css({
          position: "relative",
          width: "240px",
          height: "160px",
          transform: `scale(${state.zoom})`,
          "transform-origin": "0 0",
        }),
      }),
    }),
    shape: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, { key }) => {
        const at = state.positions[key]
        return {
          tabindex: "0",
          style: css({ position: "absolute", left: `${at.x}px`, top: `${at.y}px`, "touch-action": "none" }),
        }
      },
      live: live<CanvasState, any, { value: string }>((state, { api, key }) => ({
        style: api.move.style(state, key),
      })),
      on: {
        keydown: (event, { api, key }) => api.move.keydown(event, key),
        pointerdown: (event, { el, api, key }) => api.move.pointerdown(event, key, el!),
      },
    }),
    action: slot<{ value: string }>({
      props: { value: "string" },
      attrs: () => ({ type: "button" }),
      press: ({ api, key }) => api.act(key),
    }),
  }),
})

const parts = createParts(canvas, { root: "div", surface: "div", shape: "div", action: "button" })

const Canvas = parts.Root

const CanvasSurface = parts.Surface

const CanvasShape = parts.Shape

const CanvasAction = parts.Action

function Example() {
  const [zoom, setZoom] = React.useState(1)
  const [positions, setPositions] = React.useState<Record<string, MovePoint>>({ circle: { x: 40, y: 40 } })
  return (
    <div data-slot="stack">
      <div data-slot="row">
        {[0.5, 1, 1.5].map((option) => (
          <button
            key={option}
            type="button"
            data-variant="ghost"
            data-size="sm"
            aria-pressed={zoom === option}
            onClick={() => setZoom(option)}
          >
            {option * 100}%
          </button>
        ))}
      </div>
      <Canvas aria-label="Canvas" zoom={zoom} onPositionsChange={setPositions}>
        <div data-slot="move-area">
          <CanvasSurface>
            <CanvasShape value="circle" aria-label="Circle" data-shape="round" />
            <CanvasShape value="square" aria-label="Square" />
          </CanvasSurface>
        </div>
        <div data-slot="row">
          <CanvasAction value="center" data-size="sm">
            Center
          </CanvasAction>
          <CanvasAction value="nudge" data-size="sm">
            Nudge right
          </CanvasAction>
          <p data-slot="output">
            Circle at {positions.circle.x}, {positions.circle.y}
          </p>
        </div>
      </Canvas>
    </div>
  )
}

export {
  Canvas,
  canvas,
  CanvasAction,
  type CanvasOptions,
  CanvasShape,
  type CanvasState,
  CanvasSurface,
  Example,
}
