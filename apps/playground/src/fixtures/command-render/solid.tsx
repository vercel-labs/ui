import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui-sdk/solid/command"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
import { commandFixture as f } from "tests/fixtures/command.ts"

// Parts rendered as other elements, with render functions and class names of state.
function Fixture() {
  const [action, setAction] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <Command
        class={(state) => `command ${state.page ? "is-paged" : "is-first"}`}
        onAction={(value) => {
          setAction(`action:${value}`)
        }}
      >
        <CommandInput class="input" aria-label={f.input} />
        <CommandList class="command-list">
          <CommandItem
            class="item"
            value="docs"
            render={(props) => <a {...props} href="#docs" />}
          >
            Docs
          </CommandItem>
          <For each={f.groups[0].items.slice(0, 2)}>
            {(item) => (
              <CommandItem
                class={(state) =>
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
            )}
          </For>
        </CommandList>
      </Command>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
