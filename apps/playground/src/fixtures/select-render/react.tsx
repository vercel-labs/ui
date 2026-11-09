import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { selectFixture as f } from "tests/fixtures/select.ts"

// Parts rendered as other elements, with render functions and class names of state.
function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Select name={f.name} placeholder={f.placeholder}>
        <SelectLabel className="label">{f.label}</SelectLabel>
        <SelectTrigger
          className={(state) =>
            `trigger ${state.open ? "is-open" : "is-closed"}`
          }
          render={(props, state) => (
            <button {...props}>
              <SelectValue />
              <span aria-hidden="true">{state.open ? "▲" : "▼"}</span>
            </button>
          )}
        />
        <SelectContent className="popup list-popup">
          <SelectItem className="item" value="docs" render={<a href="#docs" />}>
            Docs
          </SelectItem>
          {f.items.slice(0, 3).map((item) => (
            <SelectItem key={item.value} className="item" value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <button>After</button>
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
