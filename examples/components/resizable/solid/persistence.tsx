import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/solid/resizable"

function Example() {
  return (
    <Resizable autoSaveId="docs-persistence">
      <ResizablePanel id="docs-sidebar" defaultSize={30} minSize={20}>
        Sidebar
      </ResizablePanel>
      <ResizableHandle aria-label="Resize sidebar">
        <div />
      </ResizableHandle>
      <ResizablePanel id="docs-content">Content</ResizablePanel>
    </Resizable>
  )
}

export { Example }
