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
    <div class="flex w-full max-w-md flex-col gap-3">
      <Resizable
        controller={editor}

        class="h-50 w-full rounded-2xl border border-border"
      >
        <ResizablePanel
          id="controller-sidebar"
          defaultSize={30}
          minSize={20}
          collapsible
          class="flex items-center justify-center p-6 text-sm font-medium"
        >
          Sidebar
        </ResizablePanel>
        <ResizableHandle
          aria-label="Resize sidebar"
          class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"
        />
        <ResizablePanel class="flex items-center justify-center p-6 text-sm font-medium">
          Editor
        </ResizablePanel>
      </Resizable>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none"
          onClick={() => editor.collapse("controller-sidebar")}
        >
          Collapse
        </button>
        <button
          type="button"
          class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none"
          onClick={() => editor.expand("controller-sidebar")}
        >
          Expand
        </button>
        <button
          type="button"
          class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none"
          onClick={() => editor.resize("controller-sidebar", "240px")}
        >
          240px
        </button>
        <button
          type="button"
          class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none"
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
        <output class="text-sm text-muted-foreground tabular-nums">{reading()}</output>
      </Show>
    </div>
  )
}

export { Example }
