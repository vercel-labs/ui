import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemIndicator,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { createRoot } from "react-dom/client"
import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A long menu for the counts specs. Every other item reads `highlighted` in
// its render function, so specs can tell plain items' renders from watched
// ones. A checkbox item at the end changes state that only it and its
// indicator show.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Menu>
        <MenuTrigger>File</MenuTrigger>
        <MenuContent
          className="popup"
          style={{ maxHeight: 320, overflow: "auto" }}
        >
          {items.map((item, index) =>
            index % 2 ? (
              <MenuItem
                key={item.value}
                className="item"
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
                key={item.value}
                className="item"
                value={item.value}
                render={(props) => {
                  countRender("plain")
                  return <div {...props} />
                }}
              >
                {item.label}
              </MenuItem>
            )
          )}
          <MenuCheckboxItem
            className="item"
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
  createRoot(root).render(<Fixture />)
}

export { mount }
