import { useShortcut } from "@ui-sdk/solid/shortcuts"
import { createToolbarController, Toolbar, ToolbarButton } from "@ui-sdk/solid/toolbar"
import { createSignal, For } from "solid-js"

function Example() {
  const toolbar = createToolbarController()
  const [action, setAction] = createSignal("nothing yet")
  useShortcut("alt+f10", () => toolbar.focus(), { allowInInput: true })
  return (
    <div data-slot="stack">
      <textarea aria-label="Notes" placeholder="Type, then press Alt+F10" />
      <Toolbar controller={toolbar} aria-label="Notes">
        <For each={["Bold", "Italic", "Link"]}>
          {(label) => (
            <ToolbarButton data-variant="secondary" onClick={() => setAction(label.toLowerCase())}>
              {label}
            </ToolbarButton>
          )}
        </For>
      </Toolbar>
      <div data-slot="row">
        <button data-variant="secondary" type="button" onClick={() => toolbar.focus()}>
          Focus toolbar
        </button>
        <output data-slot="output">Last: {action()}</output>
      </div>
    </div>
  )
}

export { Example }
