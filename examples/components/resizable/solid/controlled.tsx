import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/solid/resizable"
import { createSignal } from "solid-js"

function Example() {
  const [layout, setLayout] = createSignal([30, 70])
  return (
    <div data-slot="stack">
      <Resizable layout={layout()} onLayoutChange={setLayout}>
        <ResizablePanel minSize={20}>Files</ResizablePanel>
        <ResizableHandle aria-label="Resize files" />
        <ResizablePanel minSize={20}>Editor</ResizablePanel>
      </Resizable>
      <div data-slot="row">
        <button data-variant="secondary" type="button" onClick={() => setLayout([20, 80])}>
          Narrow
        </button>
        <button data-variant="secondary" type="button" onClick={() => setLayout([50, 50])}>
          Even
        </button>
      </div>
      <output data-slot="output">{layout().map(Math.round).join(" / ")}</output>
    </div>
  )
}

export { Example }
