"use client"

import {
  createChange,
  createCellRange,
  createGridFocus,
  createUndoStack,
  createInlineEdit,
  css,
  definePrimitive,
  matchesShortcut,
  type CellRange,
  type GridCell,
} from "@ui-sdk/core"
import { createParts, usePart, type PartProps } from "@ui-sdk/react/primitive"
import { cn } from "cn"
import { Redo2Icon, SparklesIcon, Undo2Icon } from "lucide-react"
import * as React from "react"
import { Numeral, Title } from "./home-posters"

type Cells = Record<string, string>
type SheetState = {
  cells: Cells
  pending: string[]
  active: GridCell | null
  range: CellRange | null
  editing: string | null
}
type SheetOptions = {
  cells: Cells
  pending?: string[]
  onCellsChange?: (cells: Cells) => void
  onRun?: (names: string[]) => void
  onUndo?: () => void
  onRedo?: () => void
}
type CellState = {
  value: string
  active: boolean
  selected: boolean
  editing: boolean
  pending: boolean
}

const ink = "border border-foreground"
const ring =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff]"
const label = "font-mono text-[10px] tracking-[0.06em] uppercase"
const press = cn(
  "inline-flex h-7 min-w-7 shrink-0 cursor-default items-center justify-center gap-1.5 bg-background px-2 font-mono text-[10px] tracking-[0.06em] uppercase select-none hover:bg-foreground/[0.06] disabled:opacity-40 [&_svg]:size-3.5",
  ink,
  ring
)

const rows = 7
const cols = 4
const columnName = (col: number) => String.fromCharCode(65 + col)
const cellName = ({ row, col }: GridCell) => `${columnName(col)}${row + 1}`

const start: Cells = {
  A1: "Customer",
  B1: "Feedback",
  C1: "Feeling",
  D1: "Next step",
  A2: "Acme",
  B2: "Checkout keeps timing out on my phone.",
  A3: "Globex",
  B3: "Love the new dashboard, it's so much faster.",
  A4: "Initech",
  B4: "We can't roll this out until you support SSO.",
  A5: "Umbrella",
  B5: "The pricing page is confusing for teams.",
  A6: "Hooli",
  B6: "Exports are great, but the dates in the CSV are wrong.",
  A7: "Stark",
  B7: "Support answered in minutes. Thank you!",
}

const answers: Cells = {
  C2: "Frustrated",
  C3: "Happy",
  C4: "Blocked",
  C5: "Confused",
  C6: "Mixed",
  C7: "Happy",
  D2: "Fix the mobile checkout",
  D3: "Ask for a quote",
  D4: "Share the SSO date",
  D5: "Add a team example",
  D6: "Fix CSV date format",
  D7: "Thank the support team",
}

const sheet = definePrimitive({
  name: "sheet",
  options: {
    cells: "value",
    pending: "list",
    onCellsChange: "callback",
    onRun: "callback",
    onUndo: "callback",
    onRedo: "callback",
  },
  state: (options: SheetOptions): SheetState => ({
    cells: options.cells,
    pending: options.pending ?? [],
    active: null,
    range: null,
    editing: null,
  }),
  sync: (options) => ({ cells: options.cells, pending: options.pending ?? [] }),
  api: (context) => {
    const { store } = context
    const change = createChange(context)
    const write = (entries: [string, string][]) => {
      const cells = { ...store.get().cells }
      for (const [name, text] of entries) {
        if (text === "") {
          delete cells[name]
        } else {
          cells[name] = text
        }
      }
      return change("cells", cells, { reason: "imperative" })
    }
    const grid = createGridFocus<SheetState>(context, {
      key: "active",
      rows: () => rows,
      cols: () => cols,
    })
    const range = createCellRange<SheetState>(context, {
      key: "range",
      grid,
      rows: () => rows,
      cols: () => cols,
    })
    const edit = createInlineEdit<SheetState>(context, {
      key: "editing",
      value: (name) => store.get().cells[name] ?? "",
      commit: (name, text) => write([[name, text.trim()]]),
    })
    const selected = () => {
      const bounds = range.bounds(store.get())
      const names: string[] = []
      if (bounds) {
        for (let row = bounds.top; row <= bounds.bottom; row++) {
          for (let col = bounds.left; col <= bounds.right; col++) {
            names.push(cellName({ row, col }))
          }
        }
      }
      return names
    }
    return {
      grid,
      range,
      edit,
      run: () => context.options().onRun?.(selected()),
      cellKeydown(event: KeyboardEvent, cell: GridCell) {
        if (store.get().editing) {
          return
        }
        if (matchesShortcut(event, "mod+shift+z")) {
          event.preventDefault()
          return context.options().onRedo?.()
        }
        if (matchesShortcut(event, "mod+z")) {
          event.preventDefault()
          return context.options().onUndo?.()
        }
        if (matchesShortcut(event, "mod+enter")) {
          event.preventDefault()
          return context.options().onRun?.(selected())
        }
        if (
          (event.key === "Delete" || event.key === "Backspace") &&
          !event.metaKey &&
          !event.ctrlKey
        ) {
          event.preventDefault()
          return write(selected().map((name) => [name, ""]))
        }
        if (edit.keydown(event, cellName(cell))) {
          return
        }
        range.keydown(event)
      },
      cellPointerdown(event: PointerEvent, cell: GridCell, name: string) {
        if (store.get().editing !== name) {
          range.pointerdown(event, cell)
        }
      },
      editorKeydown(event: KeyboardEvent) {
        const active = grid.active()
        if (!edit.inputKeydown(event) || !active || event.key !== "Enter") {
          return
        }
        grid.focus(
          { row: Math.min(rows - 1, active.row + 1), col: active.col },
          { reason: "list-navigation", event }
        )
        range.select(null, { reason: "list-navigation", event })
      },
    }
  },
  slots: (slot) => ({
    grid: slot({
      attrs: () => ({
        role: "grid",
        "aria-rowcount": String(rows),
        "aria-colcount": String(cols + 1),
        "aria-multiselectable": "true",
        style: css({
          display: "grid",
          "grid-template-columns":
            "1.75rem minmax(4.5rem,0.7fr) minmax(0,2fr) minmax(5rem,0.8fr) minmax(0,1.4fr)",
        }),
      }),
    }),
    row: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (_state, { key }) => ({
        role: "row",
        "aria-rowindex": String(Number(key) + 1),
        style: "display:contents",
      }),
    }),
    header: slot<{ value: string }, { selected: boolean }>({
      props: { value: "string" },
      state: (state, { key, api }) => {
        const bounds = api.range.bounds(state)
        const row = Number(key)
        return {
          selected: !!bounds && row >= bounds.top && row <= bounds.bottom,
        }
      },
      attrs: (state, { key, api }) => {
        const bounds = api.range.bounds(state)
        const row = Number(key)
        return {
          role: "rowheader",
          "aria-colindex": "1",
          "data-selected":
            bounds && row >= bounds.top && row <= bounds.bottom
              ? ""
              : undefined,
        }
      },
    }),
    cell: slot<{ id: string; row: number; col: number }, CellState>({
      props: { row: "number", col: "number" },
      state: (state, { key, props, api }) => ({
        value: state.cells[key] ?? "",
        active: api.grid.isActive(state, props),
        selected: api.range.contains(state, props),
        editing: state.editing === key,
        pending: state.pending.includes(key),
      }),
      attrs: (state, { key, props, api }) => ({
        role: props.row === 0 ? "columnheader" : "gridcell",
        "aria-colindex": String(props.col + 2),
        "aria-label": `${key}${state.cells[key] ? `, ${state.cells[key]}` : ""}`,
        tabindex: api.grid.tabIndex(state, props),
        "data-active": api.grid.isActive(state, props) ? "" : undefined,
        ...api.range.cellAttrs(state, props),
      }),
      on: {
        keydown: (event, { api, props }) => api.cellKeydown(event, props),
        dblclick: (event, { api, key }) => api.edit.dblclick(event, key),
      },
      bind: (el, { api, props, key }) => {
        // The range reads the press's currentTarget, which a delegated listener doesn't give.
        const press = (event: PointerEvent) =>
          api.cellPointerdown(event, props, key)
        el.addEventListener("pointerdown", press)
        const leave = api.range.bind(el, props)
        return () => {
          el.removeEventListener("pointerdown", press)
          leave()
        }
      },
    }),
    editor: slot({
      attrs: () => ({
        "aria-label": "Edit cell",
        autocomplete: "off",
        spellcheck: "false",
      }),
      on: {
        keydown: (event, { api }) => api.editorKeydown(event),
        focusout: (event, { api }) => api.edit.end("focus-out", event),
      },
      bind: (el, { api }) => api.edit.bindInput(el as HTMLInputElement),
    }),
    run: slot({
      attrs: () => ({ type: "button" }),
      press: ({ api }) => api.run(),
    }),
  }),
})

const parts = createParts(sheet, {
  grid: "div",
  editor: "input",
  run: "button",
})
const Sheet = parts.Root
const SheetGrid = parts.Grid
const SheetEditor = parts.Editor
const SheetRun = parts.Run

function SheetRow({ value, ...props }: { value: number } & PartProps<"div">) {
  return usePart(sheet, "row", { value: String(value) }, props)
}

function SheetHeader({
  value,
  ...props
}: { value: number } & PartProps<"div", { selected: boolean }>) {
  return usePart(sheet, "header", { value: String(value) }, props)
}

function SheetCell({
  row,
  col,
  ...props
}: { row: number; col: number } & PartProps<"div", CellState>) {
  return usePart(sheet, "cell", { id: cellName({ row, col }), row, col }, props)
}

function SheetDemo() {
  const [cells, setCells] = React.useState(start)
  const [pending, setPending] = React.useState<string[]>([])
  const [note, setNote] = React.useState(
    "Select cells under Feeling or Next step, then press Run"
  )
  const stack = React.useRef(createUndoStack(start))
  const timers = React.useRef<number[]>([])
  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const commit = (next: Cells) => {
    setCells(next)
    stack.current.record(next)
  }
  const step = (direction: "undo" | "redo") => {
    if (pending.length) {
      return
    }
    const next = stack.current[direction]()
    if (!next) {
      return
    }
    setCells(next)
    setNote(direction === "undo" ? "Undone" : "Redone")
  }
  const run = (names: string[]) => {
    if (pending.length) {
      return
    }
    const targets = names.filter((name) => answers[name])
    if (!targets.length) {
      setNote("Select cells under Feeling or Next step first")
      return
    }
    setPending(targets)
    setNote(
      `Filling ${targets.length} ${targets.length === 1 ? "cell" : "cells"}`
    )
    let next = cells
    timers.current = targets.map((name, index) =>
      window.setTimeout(
        () => {
          next = { ...next, [name]: answers[name] }
          setCells(next)
          setPending((current) => current.filter((item) => item !== name))
          if (index < targets.length - 1) {
            return
          }
          stack.current.record(next)
          setNote(
            `Filled ${targets.length} ${targets.length === 1 ? "cell" : "cells"}. Press ⌘Z to undo`
          )
        },
        300 + index * 180
      )
    )
  }
  const filled = Object.keys(answers).filter((name) => cells[name]).length
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
        <Title id="spreadsheet" max={6.5} className="-ms-[0.05em]">
          Spreadsheet.
        </Title>
        <div className="flex items-baseline gap-2">
          <Numeral className="text-[length:clamp(2rem,6cqi,3.5rem)]">
            {filled}/{Object.keys(answers).length}
          </Numeral>
          <span className={cn(label, "text-muted-foreground")}>
            cells filled
          </span>
        </div>
      </div>
      <Sheet
        cells={cells}
        pending={pending}
        onCellsChange={commit}
        onRun={run}
        onUndo={() => step("undo")}
        onRedo={() => step("redo")}
      >
        <div className="flex flex-col gap-4">
          <div
            className={cn(
              "flex items-center gap-2 bg-background p-1.5 ps-3",
              ink
            )}
          >
            <SparklesIcon aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="min-w-0 flex-1 truncate font-mono text-[12px]">
              Fill this in from the feedback
            </span>
            <SheetRun className={press}>Run</SheetRun>
          </div>
          <div className="overflow-x-auto [scrollbar-width:none]">
            <SheetGrid
              aria-label="Customer feedback"
              className={cn("min-w-[34rem] bg-background text-[13px]", ink)}
            >
              {Array.from({ length: rows }, (_, row) => (
                <SheetRow key={row} value={row}>
                  <SheetHeader
                    value={row}
                    className="flex h-11 items-center justify-center border-e border-b border-foreground/15 font-mono text-[10px] text-muted-foreground tabular-nums data-selected:bg-foreground/[0.07] data-selected:text-foreground"
                  >
                    {row + 1}
                  </SheetHeader>
                  {Array.from({ length: cols }, (_, col) => (
                    <SheetCell
                      key={col}
                      row={row}
                      col={col}
                      className={cn(
                        "relative flex h-11 min-w-0 cursor-cell items-center border-e border-b border-foreground/15 px-2 select-none last:border-e-0 data-selected:bg-foreground/[0.07] data-active:outline-2 data-active:-outline-offset-2 data-active:outline-foreground data-active:outline-solid",
                        row === 0 &&
                          "font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase"
                      )}
                    >
                      {({ value, editing, pending: waiting }) =>
                        editing ? (
                          <SheetEditor className="h-full w-full bg-transparent outline-none pointer-coarse:text-base" />
                        ) : waiting ? (
                          <span
                            aria-hidden="true"
                            className="h-2 w-2/3 animate-pulse bg-foreground/15"
                          />
                        ) : (
                          <span className="truncate">{value}</span>
                        )
                      }
                    </SheetCell>
                  ))}
                </SheetRow>
              ))}
            </SheetGrid>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Undo"
              onClick={() => step("undo")}
              className={press}
            >
              <Undo2Icon aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Redo"
              onClick={() => step("redo")}
              className={press}
            >
              <Redo2Icon aria-hidden="true" />
            </button>
            <span
              aria-live="polite"
              className={cn(label, "ms-1 truncate text-muted-foreground")}
            >
              {note}
            </span>
          </div>
        </div>
      </Sheet>
    </>
  )
}

export { SheetDemo }
