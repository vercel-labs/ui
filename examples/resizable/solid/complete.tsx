import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/solid/resizable"
import { createSignal } from "solid-js"

function Example() {
  const [moves, setMoves] = createSignal(0)
  const [saved, setSaved] = createSignal("nothing yet")
  return (
    <div class="flex w-full max-w-md flex-col gap-3">
      <Resizable
        onLayoutChange={() => setMoves((count) => count + 1)}
        onLayoutCommit={(layout, details) =>
          setSaved(`${layout.map(Math.round).join(" / ")} after ${details.reason}`)
        }
        class="h-50 w-full rounded-2xl border border-border"
      >
        <ResizablePanel defaultSize={40} class="flex items-center justify-center p-6 text-sm font-medium">
          Files
        </ResizablePanel>
        <ResizableHandle
          aria-label="Resize files"
          class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"
        />
        <ResizablePanel class="flex items-center justify-center p-6 text-sm font-medium">
          Editor
        </ResizablePanel>
      </Resizable>
      <output class="text-sm text-muted-foreground tabular-nums">
        {moves()} changes, saved {saved()}
      </output>
    </div>
  )
}

export { Example }
