// Moving focus through a grid of cells by row and column, as WAI-ARIA's grid
// pattern asks: arrows move a cell, Home and End to the row's ends, Control
// with them to the grid's corners, Page Up and Page Down a page of rows. It
// works by index, not by element, so a grid that renders only the rows in
// view, through `createVirtualizer`, moves to rows that aren't rendered yet:
// `reveal` scrolls them in and focus lands once their cell binds.
import type { PrimitiveContext } from "../kernel/primitive-types"
import { isRTL } from "../platform/env"

/**
 * A cell, by its row and column index from 0.
 * @experimental
 */
type GridCell = { row: number; col: number }

/**
 * Why the active cell moved: a key, a press on a cell, or a call from code.
 * @experimental
 */
type GridFocusReason = "list-navigation" | "item-press" | "imperative"

/**
 * How `createGridFocus` reads the grid.
 * @experimental
 */
type GridFocusOptions<State extends object> = {
  /** The state key that holds the active `GridCell`, or `null` before the grid is entered. */
  key: keyof State & string
  /** How many rows the grid has, header rows included when they hold cells. */
  rows: () => number
  /** How many columns. */
  cols: () => number
  /** How many rows Page Up and Page Down move, usually how many show. @defaultValue 10 */
  pageSize?: () => number
  /** Cells that can't take focus, skipped by the arrows and by the tab stop before the grid is entered. */
  disabled?: (cell: GridCell) => boolean
  /**
   * Shows a cell that may not be rendered, like `virtualizer.scrollToIndex(cell.row)`,
   * before focus moves to it.
   */
  reveal?: (cell: GridCell) => void
  /** Runs after the active cell moves, with the cell it left. */
  onMove?: (
    cell: GridCell,
    details: {
      from: GridCell | null
      reason: GridFocusReason
      event?: Event
      shift: boolean
    }
  ) => void
}

const sameCell = (
  a: GridCell | null | undefined,
  b: GridCell | null | undefined
) => !!a && !!b && a.row === b.row && a.col === b.col

const cellName = (cell: GridCell) => `${cell.row}:${cell.col}`

/**
 * How a cell slot reads the active cell, for its `selects`, so a move reaches
 * the cell it leaves and the one it lands on, not every cell:
 * `selects({ active: byCell })`. The slot's props are the cell's `row` and `col`.
 * @experimental
 */
const byCell = {
  values: ({ props }: { props: GridCell }) => [cellName(props)],
  moved(
    previous: GridCell | null | undefined,
    next: GridCell | null | undefined,
    notify: (name: string) => void
  ) {
    // Before the grid is entered, the first cell that isn't disabled has the tab stop.
    if (!previous || !next) {
      return true
    }
    notify(cellName(previous))
    notify(cellName(next))
  },
}

/**
 * Gives a grid one tab stop and moves it by row and column. Call it once in
 * `api`, keep it on the api, and wire the cell slot:
 *
 * ```ts
 * grid: slot({ role: "grid", keys: { none: "Focus stays on a cell, whose keydown handles them." } }),
 * cell: slot<{ row: number; col: number }>({
 *   role: "gridcell",
 *   focus: "roving",
 *   selects: selects({ active: byCell }),
 *   keys: [
 *     "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
 *     "Home", "End", "ctrl+Home", "ctrl+End", "PageUp", "PageDown",
 *   ],
 *   attrs: (state, { props, api }) => ({ tabindex: api.grid.tabIndex(state, props) }),
 *   on: {
 *     keydown: (event, { api }) => api.grid.keydown(event),
 *     pointerdown: (event, { api, props }) => api.grid.focus(props, { reason: "item-press", event }),
 *   },
 *   bind: (el, { api, props }) => api.grid.bind(el, props),
 * })
 * ```
 *
 * Shift with a move is reported in `onMove`, so a grid can extend a range
 * selection from it.
 * @experimental
 */
function createGridFocus<State extends object>(
  context: Pick<PrimitiveContext<any, State, any>, "store" | "options">,
  options: GridFocusOptions<State>
) {
  const { store } = context
  const cells = new Map<string, HTMLElement>()
  const id = (cell: GridCell) => `${cell.row}:${cell.col}`
  const active = () => store.get()[options.key] as GridCell | null
  // The cell to focus once it binds, when it wasn't rendered as focus moved to it.
  let pending: GridCell | null = null
  // Kept until state or options change, so rendering every cell scans the grid once.
  let first:
    | {
        state: State
        options: object
        rows: number
        cols: number
        cell: GridCell | null
      }
    | undefined

  const allowed = (cell: GridCell) =>
    cell.row >= 0 &&
    cell.col >= 0 &&
    cell.row < options.rows() &&
    cell.col < options.cols() &&
    !options.disabled?.(cell)

  function firstAllowed(state: State) {
    const rows = options.rows()
    const cols = options.cols()
    const current = context.options()
    if (
      first?.state === state &&
      first.options === current &&
      first.rows === rows &&
      first.cols === cols
    ) {
      return first.cell
    }
    let cell: GridCell | null = null
    for (let row = 0; row < rows && !cell; row++) {
      for (let col = 0; col < cols && !cell; col++) {
        if (allowed({ row, col })) {
          cell = { row, col }
        }
      }
    }
    first = { state, options: current, rows, cols, cell }
    return cell
  }

  // The nearest allowed cell from `cell` going by `dr`, `dc`, or `cell` itself.
  function step(cell: GridCell, dr: number, dc: number) {
    let next = { row: cell.row + dr, col: cell.col + dc }
    while (
      next.row >= 0 &&
      next.col >= 0 &&
      next.row < options.rows() &&
      next.col < options.cols()
    ) {
      if (allowed(next)) {
        return next
      }
      next = { row: next.row + dr, col: next.col + dc }
    }
    return cell
  }

  function focusElement(cell: GridCell) {
    const el = cells.get(id(cell))
    if (el?.isConnected) {
      pending = null
      if (el.ownerDocument.activeElement !== el) {
        el.focus({ preventScroll: false })
      }
    } else {
      pending = cell
    }
  }

  const api = {
    /** The active cell, which has the tab stop. */
    active,
    /**
     * `"0"` for the active cell, else `"-1"`, for a `tabindex` attribute. Before
     * the grid is entered, the first cell that isn't disabled has it, row by row.
     */
    tabIndex(state: State, cell: GridCell) {
      return sameCell(
        (state[options.key] as GridCell | null) ?? firstAllowed(state),
        cell
      )
        ? "0"
        : "-1"
    },
    /** Whether a cell is the active one. */
    isActive(state: State, cell: GridCell) {
      return sameCell(state[options.key] as GridCell | null, cell)
    },
    /** Joins a rendered cell, so focus can reach it. Return its cleanup from the slot's `bind`. */
    bind(el: HTMLElement, cell: GridCell) {
      const key = id(cell)
      cells.set(key, el)
      if (sameCell(pending, cell)) {
        queueMicrotask(() => sameCell(pending, cell) && focusElement(cell))
      }
      return () => {
        if (cells.get(key) === el) {
          cells.delete(key)
        }
      }
    },
    /** Makes a cell active and focuses it, scrolling it in through `reveal` first. */
    focus(
      cell: GridCell,
      details: { reason: GridFocusReason; event?: Event; shift?: boolean } = {
        reason: "imperative",
      }
    ) {
      if (!allowed(cell)) {
        return false
      }
      const from = active()
      if (!sameCell(from, cell)) {
        store.set({
          [options.key]: { row: cell.row, col: cell.col },
        } as Partial<State>)
      }
      options.reveal?.(cell)
      focusElement(cell)
      if (!sameCell(from, cell)) {
        options.onMove?.(cell, {
          from,
          reason: details.reason,
          event: details.event,
          shift: !!details.shift,
        })
      }
      return true
    },
    /**
     * Handles a key pressed in the grid and returns whether it moved. Arrows
     * move a cell, flipped left to right in right-to-left text; Home and End
     * go to the row's ends, or with Control the grid's; Page Up and Page Down
     * move `pageSize` rows.
     */
    keydown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.metaKey) {
        return false
      }
      const from = active() ?? firstAllowed(store.get())
      if (!from) {
        return false
      }
      const rtl = event.target instanceof Element && isRTL(event.target)
      const page = options.pageSize?.() ?? 10
      const last = { row: options.rows() - 1, col: options.cols() - 1 }
      let to: GridCell | undefined
      const ctrl = event.ctrlKey
      if (event.key === "ArrowUp" && !ctrl) {
        to = step(from, -1, 0)
      } else if (event.key === "ArrowDown" && !ctrl) {
        to = step(from, 1, 0)
      } else if (event.key === "ArrowLeft" && !ctrl) {
        to = step(from, 0, rtl ? 1 : -1)
      } else if (event.key === "ArrowRight" && !ctrl) {
        to = step(from, 0, rtl ? -1 : 1)
      } else if (event.key === "Home") {
        to = ctrl
          ? step({ row: -1, col: 0 }, 1, 0)
          : step({ row: from.row, col: -1 }, 0, 1)
      } else if (event.key === "End") {
        to = ctrl
          ? step({ row: last.row + 1, col: last.col }, -1, 0)
          : step({ row: from.row, col: last.col + 1 }, 0, -1)
      } else if (event.key === "PageUp") {
        to = step(
          { row: Math.max(0, from.row - page) + 1, col: from.col },
          -1,
          0
        )
      } else if (event.key === "PageDown") {
        to = step(
          { row: Math.min(last.row, from.row + page) - 1, col: from.col },
          1,
          0
        )
      }
      if (!to) {
        return false
      }
      event.preventDefault()
      return api.focus(to, {
        reason: "list-navigation",
        event,
        shift: event.shiftKey,
      })
    },
  }
  return api
}

/**
 * What `createGridFocus` returns.
 * @experimental
 */
type GridFocus = ReturnType<typeof createGridFocus>

export {
  byCell,
  createGridFocus,
  type GridCell,
  type GridFocus,
  type GridFocusOptions,
  type GridFocusReason,
}
