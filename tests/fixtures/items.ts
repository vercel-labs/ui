// Items a spec swaps in while a list is open, like options streamed in or
// sorted by the app. The spec dispatches a `fixture-items` event on the
// document with the change's name, since a press on a button would close the
// list. Fixtures run `listener` with the items of that name.
const itemsChangeEvent = "fixture-items"

function onItemsChange<Items>(
  changes: Record<string, Items>,
  listener: (items: Items) => void
) {
  const handler = (event: Event) => {
    const items = changes[(event as CustomEvent<string>).detail]
    if (items) {
      listener(items)
    }
  }
  document.addEventListener(itemsChangeEvent, handler)
  return () => document.removeEventListener(itemsChangeEvent, handler)
}

export { itemsChangeEvent, onItemsChange }
