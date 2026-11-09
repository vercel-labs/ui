import { Listbox, ListboxItem } from "@ui-sdk/react/listbox"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { listboxAction, listboxFixture as f } from "tests/fixtures/listbox.ts"

// Counts each item's renders, so a spec can check that moving focus renders
// only the items whose tab stop or selection changed.
const renders: Record<string, number> = {}
;(window as unknown as { __renders: typeof renders }).__renders = renders
const counted = (name: string) => () => {
  renders[name] = (renders[name] ?? 0) + 1
  return name
}

// Parts rendered as other elements, with render functions and class names of state.
function Fixture() {
  const [action, setAction] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <Listbox
        aria-label={f.label}
        className="listbox"
        activation="manual"
        onValueChange={(value) => setAction(listboxAction(value))}
        render={<ul />}
      >
        <ListboxItem className="item" value="docs" render={<a href="#docs" />}>
          Docs
        </ListboxItem>
        <ListboxItem
          value="star"
          className={(state) =>
            `item ${state.selected ? "is-selected" : "is-unselected"}`
          }
          render={(props, state) => (
            <li {...props}>{state.selected ? "★" : "☆"} Star</li>
          )}
        />
        {f.items.slice(0, 3).map((item) => (
          <ListboxItem
            key={item.value}
            className="item"
            value={item.value}
            render={<li />}
          >
            {counted(item.label)}
          </ListboxItem>
        ))}
      </Listbox>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { mount }
