import * as React from "react"
import {
  cellsToText,
  createCellRange,
  createGridFocus,
  definePrimitive,
  textToCells,
  type CellRange,
  type GridCell,
} from "@ui-sdk/core"
import { createParts, usePart, type PartProps } from "@ui-sdk/react/primitive"

type PricesState = { active: GridCell | null; range: CellRange | null; cells: string[][]; copied: string }

const start = [
  ["Tea", "3", "12"],
  ["Coffee", "4", "9"],
  ["Cake", "5", "4"],
  ["", "", ""],
]
const rows = start.length
const cols = start[0].length

const prices = definePrimitive({
  name: "prices",
  state: (): PricesState => ({ active: null, range: null, cells: start, copied: "" }),
  api: (context) => {
    const { store } = context
    const grid = createGridFocus<PricesState>(context, { key: "active", rows: () => rows, cols: () => cols })
    const range = createCellRange<PricesState>(context, {
      key: "range",
      grid,
      rows: () => rows,
      cols: () => cols,
    })
    return {
      grid,
      range,
      copy(event: ClipboardEvent) {
        const state = store.get()
        const text = range.text(state, ({ row, col }) => state.cells[row][col])
        event.preventDefault()
        event.clipboardData?.setData("text/plain", text)
        store.set({ copied: text })
      },
      paste(event: ClipboardEvent) {
        const state = store.get()
        const bounds = range.bounds(state)
        if (!bounds) return
        event.preventDefault()
        const pasted = textToCells(event.clipboardData?.getData("text/plain") ?? "")
        const cells = state.cells.map((row) => [...row])
        pasted.forEach((values, r) =>
          values.forEach((value, c) => {
            const row = bounds.top + r
            const col = bounds.left + c
            if (row < rows && col < cols) cells[row][col] = value
          }),
        )
        store.set({ cells })
      },
      copyAll() {
        const text = cellsToText(store.get().cells)
        store.set({ copied: text })
        navigator.clipboard?.writeText(text).catch(() => {})
      },
    }
  },
  slots: (slot) => ({
    root: slot<{}, { copied: string }>({ state: (state) => ({ copied: state.copied }) }),
    grid: slot({
      attrs: () => ({ role: "grid", style: "user-select:none;touch-action:none" }),
      on: {
        copy: (event, { api }) => api.copy(event as ClipboardEvent),
        paste: (event, { api }) => api.paste(event as ClipboardEvent),
      },
    }),
    row: slot<{ id: string }>({ props: { id: "string" }, attrs: () => ({ role: "row" }) }),
    cell: slot<{ id: string; row: number; col: number }, { text: string }>({
      props: { row: "number", col: "number" },
      state: (state, { props }) => ({ text: state.cells[props.row][props.col] }),
      attrs: (state, { props, api }) => ({
        role: "gridcell",
        tabindex: api.grid.tabIndex(state, props),
        ...api.range.cellAttrs(state, props),
      }),
      on: {
        keydown: (event, { api }) => api.range.keydown(event),
        pointerdown: (event, { api, props }) => api.range.pointerdown(event, props),
      },
      bind: (el, { api, props }) => api.range.bind(el, props),
    }),
    copyAll: slot({ attrs: () => ({ type: "button" }), press: ({ api }) => api.copyAll() }),
  }),
})

const parts = createParts(prices, { root: "div", grid: "div", row: "div", copyAll: "button" })

const Prices = parts.Root

const PricesGrid = parts.Grid

const PricesRow = parts.Row

function PricesCell({
  row,
  col,
  ...props
}: { row: number; col: number } & PartProps<"div", { text: string }>) {
  return usePart(prices, "cell", { id: `${row}:${col}`, row, col }, props, "div")
}

const PricesCopyAll = parts.CopyAll

function Example() {
  return (
    <Prices>
      {({ copied }) => (
        <>
          <PricesGrid aria-label="Prices">
            {start.map((cells, r) => (
              <PricesRow key={r} id={String(r)}>
                {cells.map((_, c) => (
                  <PricesCell key={c} row={r} col={c}>
                    {({ text }) => text}
                  </PricesCell>
                ))}
              </PricesRow>
            ))}
          </PricesGrid>
          <PricesCopyAll data-size="sm">Copy the whole sheet</PricesCopyAll>
          <pre data-copied data-slot="log">
            {copied ? copied.replaceAll("\t", " → ") : "Copied cells show here, with → for each tab."}
          </pre>
        </>
      )}
    </Prices>
  )
}

export { Example, prices, Prices, PricesCell, PricesCopyAll, PricesGrid, PricesRow, type PricesState }
