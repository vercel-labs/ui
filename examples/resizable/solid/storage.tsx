import { Resizable, ResizableHandle, ResizablePanel, type ResizableStorage } from "@ui-sdk/solid/resizable"

const session: ResizableStorage = {
  getItem: (key) => sessionStorage.getItem(key),
  setItem: (key, value) => sessionStorage.setItem(key, value),
}

function Example() {
  return (
    <Resizable
      autoSaveId="docs-storage"
      storage={session}
      class="h-50 w-full max-w-md rounded-2xl border border-border"
    >
      <ResizablePanel
        id="session-files"
        defaultSize={30}
        class="flex items-center justify-center p-6 text-sm font-medium"
      >
        Files
      </ResizablePanel>
      <ResizableHandle
        aria-label="Resize files"
        class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"
      />
      <ResizablePanel id="session-editor" class="flex items-center justify-center p-6 text-sm font-medium">
        Editor
      </ResizablePanel>
    </Resizable>
  )
}

export { Example }
