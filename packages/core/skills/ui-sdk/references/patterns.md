# Patterns the blocks leave to you

Each snippet comes from a component that passes its tests. Adapt the names. When a block grows to cover one of these, delete the pattern.

## Grid arrows with `createRovingFocus` and `move`

A set of choices in two dimensions, like emoji, colors or dates, is a `grid` of `row`s and `gridcell`s with `createGridFocus`, and the root has a name. A set in one dimension is a `listbox` of `option`s. Don't use plain buttons for the cells.

For a grid whose rows and columns are in state. Keys find cells by id, not by index. Past an edge, return `from.key` so the arrow is handled and the page doesn't scroll.

```ts
type CellProps = { value: string; row: string; column: string }
const cellKey = (row: string, column: string) => `${row}\u001f${column}`

const roving = createRovingFocus<State, CellProps>(context, {
  slot: "cell",
  key: "focused",
  move: (event, { from, rtl }) => {
    const { rows, columns } = store.get()
    const row = rows.findIndex((r) => r.id === from.props.row)
    const column = columns.findIndex((c) => c.id === from.props.column)
    const corner = event.ctrlKey || event.metaKey
    const lastRow = rows.length - 1
    const lastColumn = columns.length - 1
    const to = (
      {
        ArrowRight: [row, column + (rtl ? -1 : 1)],
        ArrowLeft: [row, column + (rtl ? 1 : -1)],
        ArrowDown: [row + 1, column],
        ArrowUp: [row - 1, column],
        Home: corner ? [0, 0] : [row, 0],
        End: corner ? [lastRow, lastColumn] : [row, lastColumn],
      } as Record<string, [number, number]>
    )[event.key]
    if (!to) return undefined
    return rows[to[0]] && columns[to[1]] ? cellKey(rows[to[0]].id, columns[to[1]].id) : from.key
  },
})
```

For a grid that flows items into rows, like an emoji or swatch grid, work from the index in `items` and a `columns` count instead. Down from a column the short last row lacks should land on its last item.

Shift is never swallowed, so a grid that selects rows extends from what `roving.keydown` returns:

```ts
const moved = roving.keydown(event, el)
if (moved?.shift && rowOf(moved.key) !== rowOf(moved.from)) {
  selection.extend(rowOf(moved.key), { from: rowOf(moved.from), reason: "list-navigation", event })
}
```

## `createRovingFocus`: `remember: false`

With `remember: false`, the stop stays on the `preferred` item even while focus moves elsewhere in the group, so the focused item can have `tabindex="-1"`. That's right for a radio group, where selection follows focus. Anywhere else, keep the default and move focus explicitly with `roving.focus(key)`.

## State derived from options and state

`sync` sees only options. When derived state depends on both, like lists split by an option (`items`) and a value that may be controlled, recompute in a store subscription that compares references. That covers every way either input changes:

```ts
let derivedFrom = { items: store.get().items, value: store.get().value }
context.onDestroy(
  store.subscribe(() => {
    const { items, value } = store.get()
    if (items === derivedFrom.items && value === derivedFrom.value) return
    derivedFrom = { items, value }
    store.set(split(items, value))
  }),
)
```

Storing the derived arrays, rather than computing them in a slot's `state`, is the safe choice: whether a part compares arrays by value isn't documented.

## Selection in internal state

`createSelection` infers its reasons from an `on<Key>Change` option. Internal state has none, so spell out the generics, and write with `store.set`:

```ts
type SelectionReason = "item-press" | "list-navigation" | "select-all"
const selection = createSelection<Options, State, "selected", SelectionReason>(context, {
  key: "selected",
  set: (selected) => (store.set({ selected }), true),
  order: () => store.get().ids,
  multiple: () => true,
  selectable: (id) => !itemById(id)?.disabled,
})
```

Clicks map to it like this. `press` gets the click, so read its modifiers:

```ts
const mouse = event as MouseEvent | undefined
if (mouse?.shiftKey) selection.extend(id, { from: store.get().focused, reason: "item-press", event: mouse })
else if (mouse?.ctrlKey || mouse?.metaKey) selection.toggle(id, { reason: "item-press", event: mouse })
else selection.choose(id, { reason: "item-press", event: mouse })
```

`selects` on an array key takes an array of values: `selects({ selected: ({ key }) => [key] })`. On a scalar key, a value or a pair: `selects({ focused: ({ key }) => [key, null] })`.

## Typeahead in a roving group

`createTypeahead()` returns the search function itself, with `reset()` and `active()` on it. Let Space continue a query in progress, else let it toggle:

```ts
if (isTypeaheadKey(event) && (event.key !== " " || typeahead.active())) {
  const items = roving.items()
  const index = typeahead(
    event.key,
    items.map((item) => labelOf(item.el)),
    items.findIndex((item) => item.el === el),
  )
  if (index !== -1) {
    event.preventDefault()
    roving.focus(items[index].key)
  }
  return
}
```

## A `createFocusRecovery` fallback

`fallback` runs after the state change, so the part that left is already gone from your lists. Walk a stable order from its key to find the neighbor that's still there, the next one first:

```ts
const recovery = createFocusRecovery<{ value: string; list: string }>({
  fallback: (lost) => {
    const { items } = store.get()
    const list = store.get()[lost.props.list]
    const at = items.findIndex((item) => item.id === lost.key)
    const next =
      items.slice(at + 1).find((item) => list.includes(item.id)) ??
      items
        .slice(0, Math.max(at, 0))
        .reverse()
        .find((item) => list.includes(item.id))
    // `slotOf` maps a list to its option slot. Return nothing to let focus go.
    return next ? context.element(slotOf(lost.props.list), next.id) : undefined
  },
})
// Bind it next to the roving group in the item slot:
bind: (el, part) => {
  const cleanups = [part.api.roving.bind(el, part), part.api.recovery.bind(el, part)]
  return () => cleanups.forEach((cleanup) => cleanup())
}
```

## Two groups of the same kind

Two lists side by side need two `createRovingFocus` groups, and a group is one slot. So give each list its own option slot, built by one function inside `slots`, and keep each block on the api by side:

```ts
slots: (slot) => {
  const option = (side: Side) =>
    slot<OptionProps>({
      props: { value: "string" },
      attrs: (state, part) => ({
        role: "option",
        tabindex: part.api.blocks[side].roving.tabIndex(state, part),
      }),
      // …
    })
  return { available: option("available"), chosen: option("chosen") /* … */ }
}
```

## Focus into a field from a grid

To let typing in a grid go back to its search field, focus the field on keydown and don't prevent the default. The browser types the character into the newly focused field. jsdom doesn't, so check this one in a real browser.

## Reasons the vocabulary lacks

Declare them in the callback's type, with a one-line comment naming which aren't shared:

```ts
// "select-all" isn't in the shared vocabulary.
export type DataGridValueChangeReason = "item-press" | "list-navigation" | "select-all"
```

## Stepper

A stepper is a list of buttons with one tab stop, and the current step has `aria-current="step"`. Don't use radio or tab roles for it. A step a person can't go to yet is `aria-disabled`.
