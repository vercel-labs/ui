"use client"

import * as React from "react"
import { createVirtualizer } from "@ui-sdk/core"

const customers = ["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark", "Wayne", "Tyrell"]

const invoices = Array.from({ length: 10_000 }, (_, index) => ({
  id: `INV-${String(index + 1).padStart(5, "0")}`,
  customer: customers[index % customers.length],
}))

const virtual = createVirtualizer({
  count: () => invoices.length,
  estimate: () => 36,
  findable: (index) => [invoices[index].id, invoices[index].customer],
})

function Example() {
  const items = React.useSyncExternalStore(virtual.subscribe, virtual.items, virtual.items)
  const scroller = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => virtual.connect(scroller.current!, { findable: true }), [])

  return (
    <div className="flex w-[26rem] max-w-full flex-col gap-2">
      <p className="m-0 text-sm text-muted-foreground">
        Search <span className="font-medium text-foreground">Acme</span> with ⌘F or Ctrl+F
      </p>
      <div
        ref={scroller}
        role="list"
        aria-label="Invoices"
        className="relative h-72 overflow-auto rounded-3xl bg-muted/50 outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <div className="relative" style={{ height: virtual.size() }}>
          {items.map((item) => (
            <div
              key={item.key}
              ref={(el) => virtual.measure(item.index, el)}
              role="listitem"
              aria-setsize={invoices.length}
              aria-posinset={item.index + 1}
              className="absolute inset-x-0 top-0 flex h-9 items-center gap-2 px-4 text-sm"
              style={{ transform: `translateY(${item.start}px)` }}
            >
              <span
                ref={(el) => virtual.bindFindable(item.index, el, 0)}
                className="font-mono text-xs tabular-nums"
              />{" "}
              <span ref={(el) => virtual.bindFindable(item.index, el, 1)} className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Example }
