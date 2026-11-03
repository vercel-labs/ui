import { Toolbar, ToolbarButton } from "@ui-sdk/solid/toolbar"
import { For } from "solid-js"

function Example() {
  return (
    <Toolbar loop={false} aria-label="Pages">
      <For each={["First", "Previous", "Next", "Last"]}>
        {(label) => <ToolbarButton data-variant="secondary">{label}</ToolbarButton>}
      </For>
    </Toolbar>
  )
}

export { Example }
