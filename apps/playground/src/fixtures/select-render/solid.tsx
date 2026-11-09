import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import { render } from "@solidjs/web"
import { For } from "solid-js"
import { selectFixture as f } from "tests/fixtures/select.ts"

// Parts rendered as other elements, with render functions and class names of state.
function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Select name={f.name} placeholder={f.placeholder}>
        <SelectLabel class="label">{f.label}</SelectLabel>
        <SelectTrigger
          class={(state) => `trigger ${state.open ? "is-open" : "is-closed"}`}
          render={(props, state) => (
            <button {...props}>
              <SelectValue />
              <span aria-hidden="true">{state.open ? "▲" : "▼"}</span>
            </button>
          )}
        />
        <SelectContent class="popup list-popup">
          <SelectItem
            class="item"
            value="docs"
            render={(props) => <a {...props} href="#docs" />}
          >
            Docs
          </SelectItem>
          <For each={f.items.slice(0, 3)}>
            {(item) => (
              <SelectItem class="item" value={item.value}>
                {item.label}
              </SelectItem>
            )}
          </For>
        </SelectContent>
      </Select>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
