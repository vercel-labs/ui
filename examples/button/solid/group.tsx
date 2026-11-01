import { Button } from "@ui-sdk/solid/button"
import { For } from "solid-js"

const actions = ["Archive", "Report", "Snooze"]

export function Example() {
  return (
    <div data-slot="row" role="group" aria-label="Message actions">
      <For each={actions}>{(action) => <Button>{action}</Button>}</For>
    </div>
  )
}
