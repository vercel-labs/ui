import {
  createResizableController,
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/solid/resizable"
import { createSignal, Show } from "solid-js"

function Example() {
  const editor = createResizableController()
  const [reading, setReading] = createSignal("")
  return (
    <div data-slot="stack">
      <Resizable controller={editor}>
        <ResizablePanel id="controller-sidebar" defaultSize={30} minSize={20} collapsible>
          Sidebar
        </ResizablePanel>
        <ResizableHandle aria-label="Resize sidebar" />
        <ResizablePanel>Editor</ResizablePanel>
      </Resizable>
      <div data-slot="row">
        <button data-variant="secondary" type="button" onClick={() => editor.collapse("controller-sidebar")}>
          Collapse
        </button>
        <button data-variant="secondary" type="button" onClick={() => editor.expand("controller-sidebar")}>
          Expand
        </button>
        <button
          data-variant="secondary"
          type="button"
          onClick={() => editor.resize("controller-sidebar", "240px")}
        >
          240px
        </button>
        <button
          data-variant="secondary"
          type="button"
          onClick={() =>
            setReading(
              `${editor.getLayout().map(Math.round).join(" / ")}${editor.isCollapsed(0) ? ", collapsed" : ""}`,
            )
          }
        >
          Read
        </button>
      </div>
      <Show when={reading()}>
        <output data-slot="output">{reading()}</output>
      </Show>
    </div>
  )
}

export { Example }
