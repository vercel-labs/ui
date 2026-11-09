import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import { render } from "@solidjs/web"
import { For, untrack } from "solid-js"
import {
  countRender,
  mountWhenAsked,
  perfItems,
  perfSize,
} from "tests/fixtures/perf.ts"

// A long select for the counts specs. Every other option reads
// `highlighted` in its render function, so specs can tell plain options'
// renders from watched ones. Solid can't read the items' labels among the
// children before they render, so `itemToLabel` gives the trigger its label.
const items = perfItems(perfSize())
const labels = new Map(items.map((item) => [item.value, item.label]))

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Select
        defaultValue={items[0].value}
        itemToLabel={(value) => labels.get(value) ?? value}
      >
        <SelectTrigger aria-label="Pick" class="trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent class="popup list-popup">
          <For each={items}>
            {(item, index) =>
              // The list never reorders, so a row reads its place once.
              untrack(index) % 2 ? (
                <SelectItem
                  class="item"
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
                  class="item"
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
            }
          </For>
        </SelectContent>
      </Select>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => render(() => <Fixture />, target))
}

export { mount }
