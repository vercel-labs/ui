import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"

// Counts renders of each custom item, so specs can check what re-renders.
const renders = { watched: 0, plain: 0 }
;(window as unknown as { __renders: typeof renders }).__renders = renders

function Fixture() {
  const [action, setAction] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <Menu onAction={setAction}>
        <MenuTrigger>File</MenuTrigger>
        <MenuContent class="popup">
          <MenuItem
            class="item"
            value="docs"
            render={(props) => <a {...props} href="#docs" />}
          >
            Docs
          </MenuItem>
          <MenuItem
            class="item"
            value="watched"
            render={(props, state) => {
              renders.watched++
              return (
                <div {...props}>
                  {state.highlighted ? "→ " : ""}
                  {props.children}
                </div>
              )
            }}
          >
            Watched
          </MenuItem>
          <MenuItem
            class="item"
            value="plain"
            render={(props) => {
              renders.plain++
              return <div {...props} />
            }}
          >
            Plain
          </MenuItem>
          <MenuCheckboxItem
            value="pinned"
            class={(state) =>
              `item ${state.checked ? "is-checked" : "is-unchecked"}`
            }
          >
            Pinned
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>
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
