import * as React from "react"
import {
  createChange,
  createMove,
  createRovingFocus,
  css,
  definePrimitive,
  live,
  spatialMove,
  type ChangeDetails,
  type MoveDraft,
  type MovePoint,
  type MoveReason,
} from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"

type StickersState = {
  positions: Record<string, MovePoint>
  focused: string | null
  moving: MoveDraft | null
}

type StickersOptions = {
  defaultPositions: Record<string, MovePoint>
  onPositionsChange?: (positions: Record<string, MovePoint>, details: ChangeDetails<MoveReason>) => void
}

const stickers = definePrimitive({
  name: "stickers",
  options: { defaultPositions: "value", onPositionsChange: "callback" },
  state: (options: StickersOptions): StickersState => ({
    positions: options.defaultPositions,
    focused: null,
    moving: null,
  }),
  live: ["moving"],
  api: (context) => {
    const change = createChange(context)
    return {
      roving: createRovingFocus<StickersState, { value: string }>(context, {
        slot: "sticker",
        key: "focused",
        move: spatialMove(),
      }),
      move: createMove<StickersState>(context, {
        key: "positions",
        draft: "moving",
        set: (value, details) => change("positions", value, details),
        step: () => 4,
        bounds: () => ({ minX: 0, minY: 0, maxX: 264, maxY: 144 }),
      }),
    }
  },
  slots: (slot) => ({
    root: slot({ attrs: () => ({ role: "group", style: "position:relative" }) }),
    sticker: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => {
        const at = state.positions[part.key] ?? { x: 0, y: 0 }
        return {
          tabindex: part.api.roving.tabIndex(state, part),
          style: css({ position: "absolute", left: `${at.x}px`, top: `${at.y}px`, "touch-action": "none" }),
        }
      },
      live: live<StickersState, any, { value: string }>((state, { api, key }) => ({
        "data-dragging": api.move.dragging(state, key) ? "" : undefined,
        style: api.move.style(state, key),
      })),
      on: {
        keydown: (event, { el, api, key }) => api.move.keydown(event, key) || api.roving.keydown(event, el!),
        pointerdown: (event, { el, api, key }) => api.move.pointerdown(event, key, el!),
      },
      bind: (el, part) => part.api.roving.bind(el, part),
    }),
  }),
})

const parts = createParts(stickers, { root: "div", sticker: "div" })

const Stickers = parts.Root

const StickersItem = parts.Sticker

function Example() {
  const [positions, setPositions] = React.useState<Record<string, MovePoint>>({
    "🌵": { x: 20, y: 24 },
    "🍋": { x: 120, y: 80 },
    "🚀": { x: 210, y: 16 },
  })
  return (
    <div className="flex flex-col gap-2">
      <Stickers
        aria-label="Stickers"
        defaultPositions={positions}
        onPositionsChange={setPositions}
        className="h-[200px] w-[320px] rounded-xl border border-border bg-muted/40"
      >
        {Object.keys(positions).map((sticker) => (
          <StickersItem
            key={sticker}
            value={sticker}
            aria-label={`Sticker ${sticker}`}
            className="grid size-14 cursor-grab place-items-center rounded-xl border border-border bg-background text-2xl shadow-sm outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 data-dragging:cursor-grabbing data-dragging:shadow-lg"
          >
            {sticker}
          </StickersItem>
        ))}
      </Stickers>
      <p className="text-xs text-muted-foreground tabular-nums">
        🍋 at {positions["🍋"].x}, {positions["🍋"].y}
      </p>
    </div>
  )
}

export { Example, stickers, Stickers, StickersItem, type StickersOptions, type StickersState }
