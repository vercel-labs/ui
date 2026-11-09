import { menu } from "@ui-sdk/core/menu"
import {
  usePart,
  usePrimitive,
  type PrimitiveHandle,
} from "@ui-sdk/react/primitive"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { countSubscriptions, perfItems, perfSize } from "tests/fixtures/perf.ts"

// Custom parts built on `usePart`, which the specs render again and
// again to count how often each part subscribes to its instance.
const items = perfItems(perfSize())

function Item({
  handle,
  value,
  label,
}: {
  handle: PrimitiveHandle<typeof menu>
  value: string
  label: string
}) {
  const children = (state: { highlighted: boolean }) =>
    `${state.highlighted ? "→ " : ""}${label}`
  return usePart(handle, "item", { value }, { children })
}

function Fixture() {
  const handle = usePrimitive(menu, {})
  React.useState(() => countSubscriptions(handle.instance))
  const [renders, setRenders] = React.useState(0)
  return (
    <div className="fixture">
      <button>Before</button>
      <button onClick={() => setRenders(renders + 1)}>Render again</button>
      <output aria-label="Renders">{renders}</output>
      <div role="menu" aria-label="Items">
        {items.map((item) => (
          <Item
            key={item.value}
            handle={handle}
            value={item.value}
            label={item.label}
          />
        ))}
      </div>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
