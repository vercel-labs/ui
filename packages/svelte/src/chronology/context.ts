import type { ChronologyStatus } from "@ui-sdk/core/chronology"
import { getContext } from "svelte"

// The value and status of the event a marker, connector, time, title or
// description belongs to.
const ItemKey = Symbol("chronology-item")

type ItemContext = {
  value: () => string
  status: () => ChronologyStatus | undefined
}

function useItem() {
  const item = getContext<ItemContext | undefined>(ItemKey)
  if (!item) {
    throw new Error(
      "Chronology markers, connectors, times, titles and descriptions must be used inside <ChronologyItem>."
    )
  }
  return item
}

export { type ItemContext, ItemKey, useItem }
