import {
  createResizableController,
  Resizable,
  ResizableHandle,
  ResizablePanel,
  type ResizableLayoutChangeReason,
} from "@ui-sdk/solid/resizable"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import {
  formatLayout,
  resizableFixture as f,
  resizableOptions,
} from "tests/fixtures/resizable.ts"

const { sidebar, main, preview } = f.editor.panels
const { code, terminal } = f.main.panels

function Fixture() {
  const options = resizableOptions()
  const controller = createResizableController()
  const [action, setAction] = createSignal("")
  const [committed, setCommitted] = createSignal<string[]>([])
  const [layout, setLayout] = createSignal<number[]>([25, 50, 25])
  const report =
    (group: string) =>
    (
      next: number[],
      details: { reason: ResizableLayoutChangeReason; cancel: () => void }
    ) => {
      if (group === f.editor.id && options.cancel) {
        return details.cancel()
      }
      setAction(formatLayout(group, next, details.reason))
      if (group === f.editor.id && options.controlled && !options.ignore) {
        setLayout(next)
      }
    }
  const commit =
    (group: string) =>
    (next: number[], details: { reason: ResizableLayoutChangeReason }) =>
      setCommitted((list) => [
        ...list,
        formatLayout(group, next, details.reason),
      ])

  return (
    <div class="fixture">
      <button>Before</button>
      <Resizable
        class="resizable"
        orientation={options.orientation}
        disabled={options.disabled}
        step={options.step}
        largeStep={options.largeStep}
        autoSaveId={options.autoSaveId}
        defaultLayout={options.defaultLayout}
        controller={controller}
        layout={options.controlled ? layout() : undefined}
        onLayoutChange={report(f.editor.id)}
        onLayoutCommit={commit(f.editor.id)}
      >
        <ResizablePanel
          id={sidebar.id}
          defaultSize={sidebar.defaultSize}
          minSize={sidebar.minSize}
          maxSize={sidebar.maxSize}
          collapsible={sidebar.collapsible}
          class="resizable-panel"
          role="group"
          aria-label={sidebar.label}
        >
          <button>Sidebar action</button>
        </ResizablePanel>
        <ResizableHandle
          class="resizable-handle"
          aria-label={f.editor.handles[0]}
          disabled={options.locked}
        />
        <ResizablePanel
          id={main.id}
          minSize={main.minSize}
          class="resizable-panel"
          role="group"
          aria-label={main.label}
        >
          <Resizable
            class="resizable-nested"
            orientation="vertical"
            onLayoutChange={report(f.main.id)}
            onLayoutCommit={commit(f.main.id)}
          >
            <ResizablePanel
              id={code.id}
              defaultSize={code.defaultSize}
              minSize={code.minSize}
              class="resizable-panel"
              role="group"
              aria-label={code.label}
            />
            <ResizableHandle
              class="resizable-handle"
              aria-label={f.main.handle}
            />
            <ResizablePanel
              id={terminal.id}
              minSize={terminal.minSize}
              collapsible={terminal.collapsible}
              class="resizable-panel"
              role="group"
              aria-label={terminal.label}
            />
          </Resizable>
        </ResizablePanel>
        <ResizableHandle
          class="resizable-handle"
          aria-label={f.editor.handles[1]}
        />
        <ResizablePanel
          id={preview.id}
          defaultSize={preview.defaultSize}
          minSize={preview.minSize}
          class="resizable-panel"
          role="group"
          aria-label={preview.label}
        />
      </Resizable>
      <div class="row">
        <button onClick={() => controller.collapse(sidebar.id)}>
          {f.buttons.collapse}
        </button>
        <button onClick={() => controller.expand(sidebar.id)}>
          {f.buttons.expand}
        </button>
        <button onClick={() => controller.resize(preview.id, f.previewSize)}>
          {f.buttons.resize}
        </button>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output role="status" aria-label="Committed">
        {committed().join(" ")}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
