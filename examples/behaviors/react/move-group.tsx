import * as React from "react"
import {
  createChange,
  createMove,
  createRovingFocus,
  css,
  definePrimitive,
  live,
  spatialMove,
  type MoveDraft,
  type MovePoint,
} from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"

type BoardState = {
  positions: Record<string, MovePoint>
  selected: string[]
  focused: string | null
  moving: MoveDraft | null
}

const titles: Record<string, string> = { plan: "Plan", draft: "Draft", ship: "Ship" }

const board = definePrimitive({
  name: "notes",
  options: { defaultPositions: "value", onPositionsChange: "callback" },
  state: (options: {
    defaultPositions: Record<string, MovePoint>
    onPositionsChange?: (positions: Record<string, MovePoint>) => void
  }): BoardState => ({
    positions: options.defaultPositions,
    selected: [],
    focused: null,
    moving: null,
  }),
  live: ["moving"],
  api: (context) => {
    const { store } = context
    const change = createChange(context)
    const move = createMove<BoardState>(context, {
      key: "positions",
      draft: "moving",
      set: (value, details) => change("positions", value, details),
      group: (key) => (store.get().selected.includes(key) ? store.get().selected : [key]),
      step: () => 20,
      disabled: (key) => key === "ship",
      label: (key) => titles[key],
      message: ({ keys, label, at }) =>
        keys.length > 1 ? `Moved ${keys.length} notes.` : `${label} is at ${at.x}, ${at.y}.`,
    })
    return {
      roving: createRovingFocus<BoardState, { value: string }>(context, {
        slot: "note",
        key: "focused",
        move: spatialMove(),
      }),
      move,
      select(key: string, add: boolean) {
        const { selected } = store.get()
        if (add)
          store.set({
            selected: selected.includes(key) ? selected.filter((other) => other !== key) : [...selected, key],
          })
        else if (!selected.includes(key)) store.set({ selected: [key] })
      },
      clear: () => store.set({ selected: [] }),
    }
  },
  slots: (slot) => ({
    root: slot({
      attrs: () => ({
        role: "listbox",
        "aria-multiselectable": "true",
        "aria-roledescription": "board",
        style: "position:relative",
      }),
      on: {
        pointerdown: (event, { el, api }) => event.target === el && api.clear(),
      },
    }),
    note: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => {
        const at = state.positions[part.key]
        return {
          role: "option",
          "aria-selected": String(state.selected.includes(part.key)),
          "aria-disabled": part.key === "ship" ? "true" : undefined,
          tabindex: part.api.roving.tabIndex(state, part),
          style: css({ position: "absolute", left: `${at.x}px`, top: `${at.y}px`, "touch-action": "none" }),
        }
      },
      live: live<BoardState, any, { value: string }>((state, { api, key }) => ({
        "data-dragging": api.move.dragging(state, key) ? "" : undefined,
        style: api.move.style(state, key),
      })),
      on: {
        keydown: (event, { el, api, key }) => {
          if (event.key === " ") {
            event.preventDefault()
            return api.select(key, true)
          }
          api.move.keydown(event, key) || api.roving.keydown(event, el!)
        },
        pointerdown: (event, { el, api, key }) => {
          api.select(key, event.shiftKey)
          api.move.pointerdown(event, key, el!)
        },
      },
      bind: (el, part) => part.api.roving.bind(el, part),
    }),
  }),
})

const parts = createParts(board, { root: "div", note: "div" })

const Board = parts.Root

const BoardNote = parts.Note

function Example() {
  const [positions, setPositions] = React.useState<Record<string, MovePoint>>({
    plan: { x: 20, y: 20 },
    draft: { x: 120, y: 60 },
    ship: { x: 220, y: 100 },
  })
  return (
    <div data-slot="stack">
      <Board aria-label="Notes" defaultPositions={positions} onPositionsChange={setPositions}>
        {Object.entries(titles).map(([key, title]) => (
          <BoardNote key={key} value={key}>
            {title}
            {key === "ship" && " 📌"}
          </BoardNote>
        ))}
      </Board>
      <p data-slot="output">
        Plan at {positions.plan.x}, {positions.plan.y} · Draft at {positions.draft.x}, {positions.draft.y}
      </p>
    </div>
  )
}

export { Board, board, BoardNote, type BoardState, Example }
