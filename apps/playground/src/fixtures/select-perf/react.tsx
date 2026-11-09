import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import { createRoot } from "react-dom/client"
import {
  countRender,
  mountWhenAsked,
  perfItems,
  perfSize,
} from "tests/fixtures/perf.ts"

// A long select for the counts specs. Every other option reads
// `highlighted` in its render function, so specs can tell plain options'
// renders from watched ones.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Select defaultValue={items[0].value}>
        <SelectTrigger aria-label="Pick" className="trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="popup list-popup">
          {items.map((item, index) =>
            index % 2 ? (
              <SelectItem
                key={item.value}
                className="item"
                value={item.value}
                label={item.label}
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
              </SelectItem>
            ) : (
              <SelectItem
                key={item.value}
                className="item"
                value={item.value}
                label={item.label}
                render={(props) => {
                  countRender("plain")
                  return <div {...props} />
                }}
              >
                {item.label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => createRoot(target).render(<Fixture />))
}

export { mount }
