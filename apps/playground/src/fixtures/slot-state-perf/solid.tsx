import { menu, type MenuItemState } from "@ui-sdk/core/menu"
import {
  usePart,
  usePrimitive,
  type PrimitiveHandle,
} from "@ui-sdk/solid/primitive"
import { render } from "@solidjs/web"
import { createSignal, For, merge } from "solid-js"
import { countSubscriptions, perfItems, perfSize } from "tests/fixtures/perf.ts"

// Custom parts built on `usePart`, which the specs render again and
// again to count how often each part subscribes to its instance. Solid
// renders nothing twice, so a round number each part writes as an attribute
// is what makes every part's spread run again.
const items = perfItems(perfSize())

function Item(props: {
  handle: PrimitiveHandle<typeof menu>
  value: string
  label: string
  round: number
}) {
  const round = {
    get "data-round"() {
      return props.round
    },
  }
  const content = {
    children: (state: MenuItemState) => [
      state.highlighted ? "→ " : "",
      props.label,
    ],
  }
  return usePart(
    props.handle,
    "item",
    () => ({ value: props.value }),
    merge(round, content)
  )
}

function Fixture() {
  const handle = usePrimitive(menu, () => ({}))
  countSubscriptions(handle.instance)
  const [renders, setRenders] = createSignal(0)
  return (
    <div class="fixture">
      <button>Before</button>
      <button onClick={() => setRenders(renders() + 1)}>Render again</button>
      <output aria-label="Renders">{renders()}</output>
      <div role="menu" aria-label="Items">
        <For each={items}>
          {(item) => (
            <Item
              handle={handle}
              value={item.value}
              label={item.label}
              round={renders()}
            />
          )}
        </For>
      </div>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
