import { Listbox, ListboxItem } from "@ui-sdk/solid/listbox"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
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
  const [action, setAction] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <Listbox
        aria-label={f.label}
        class="listbox"
        activation="manual"
        onValueChange={(value) => setAction(listboxAction(value))}
        render={(props) => <ul {...props} />}
      >
        <ListboxItem
          class="item"
          value="docs"
          render={(props) => <a {...props} href="#docs" />}
        >
          Docs
        </ListboxItem>
        <ListboxItem
          value="star"
          class={(state) =>
            `item ${state.selected ? "is-selected" : "is-unselected"}`
          }
          render={(props, state) => (
            <li {...props}>{state.selected ? "★" : "☆"} Star</li>
          )}
        />
        <For each={f.items.slice(0, 3)}>
          {(item) => (
            <ListboxItem
              class="item"
              value={item.value}
              render={(props) => <li {...props} />}
            >
              {counted(item.label)}
            </ListboxItem>
          )}
        </For>
      </Listbox>
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

export { mount }
