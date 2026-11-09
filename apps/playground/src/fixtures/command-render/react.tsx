import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui-sdk/react/command"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { commandFixture as f } from "tests/fixtures/command.ts"

// Parts rendered as other elements, with render functions and class names of state.
function Fixture() {
  const [action, setAction] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <Command
        className={(state) => `command ${state.page ? "is-paged" : "is-first"}`}
        onAction={(value) => setAction(`action:${value}`)}
      >
        <CommandInput className="input" aria-label={f.input} />
        <CommandList className="command-list">
          <CommandItem
            className="item"
            value="docs"
            render={<a href="#docs" />}
          >
            Docs
          </CommandItem>
          {f.groups[0].items.slice(0, 2).map((item) => (
            <CommandItem
              key={item.value}
              className={(state) =>
                `item ${state.highlighted ? "is-highlighted" : ""}`
              }
              value={item.value}
              label={item.label}
              render={(props, state) => (
                <div {...props}>
                  {item.label}
                  {state.highlighted ? " ←" : ""}
                </div>
              )}
            />
          ))}
        </CommandList>
      </Command>
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
