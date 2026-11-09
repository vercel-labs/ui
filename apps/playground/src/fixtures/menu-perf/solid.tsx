import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemIndicator,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { render } from "@solidjs/web"
import { For, untrack } from "solid-js"
import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A long menu for the counts specs. Every other item reads `highlighted` in
// its render function, so specs can tell plain items' renders from watched
// ones. A checkbox item at the end changes state that only it and its
// indicator show.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Menu>
        <MenuTrigger>File</MenuTrigger>
        <MenuContent
          class="popup"
          style={{ "max-height": "320px", overflow: "auto" }}
        >
          <For each={items}>
            {(item, index) =>
              // The list never reorders, so a row reads its place once.
              untrack(index) % 2 ? (
                <MenuItem
                  class="item"
                  value={item.value}
                  render={(props, state) => {
                    countRender("watched")
                    return (
                      <div {...props}>
                        {state.highlighted ? "→ " : ""}
                        {props.children}
                      </div>
                    )
                  }}
                >
                  {item.label}
                </MenuItem>
              ) : (
                <MenuItem
                  class="item"
                  value={item.value}
                  render={(props) => {
                    countRender("plain")
                    return <div {...props} />
                  }}
                >
                  {item.label}
                </MenuItem>
              )
            }
          </For>
          <MenuCheckboxItem
            class="item"
            value="wrap"
            render={(props) => {
              countRender("checkbox")
              return <div {...props} />
            }}
          >
            <MenuItemIndicator>✓</MenuItemIndicator>
            Wrap lines
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
