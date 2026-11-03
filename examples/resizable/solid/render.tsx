import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/solid/resizable"

function Example() {
  return (
    <Resizable
      class={(state) =>
        state.dragging
          ? "h-50 w-full max-w-md rounded-2xl border border-border bg-muted/50 transition-colors motion-reduce:transition-none"
          : "h-50 w-full max-w-md rounded-2xl border border-border transition-colors motion-reduce:transition-none"
      }
    >
      <ResizablePanel
        defaultSize={35}
        minSize={20}
        collapsible
        class="flex flex-col items-center justify-center gap-1 p-6 text-sm font-medium"
      >
        {(state) => (
          <>
            <span>Files</span>
            <span class="text-xs text-muted-foreground tabular-nums">
              {state.collapsed ? "Collapsed" : `${Math.round(state.size)}%`}
            </span>
          </>
        )}
      </ResizablePanel>
      <ResizableHandle
        aria-label="Resize files"
        render={(props, state) => (
          <div
            {...props}
            class={
              state.dragging
                ? "w-1 bg-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                : state.hovering
                  ? "w-1 bg-ring outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                  : "w-1 bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            }
          />
        )}
      />
      <ResizablePanel class="flex items-center justify-center p-6 text-sm font-medium">
        {(state) => `Editor, ${state.orientation}`}
      </ResizablePanel>
    </Resizable>
  )
}

export { Example }
