import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/solid/resizable"

function Example() {
  return (
    <Resizable>
      <ResizablePanel defaultSize={35} minSize={20} collapsible>
        {(state) => (
          <>
            <span>Files</span>
            <span data-slot="hint">{state.collapsed ? "Collapsed" : `${Math.round(state.size)}%`}</span>
          </>
        )}
      </ResizablePanel>
      <ResizableHandle aria-label="Resize files" render={(props) => <div {...props} />} />
      <ResizablePanel>{(state) => `Editor, ${state.orientation}`}</ResizablePanel>
    </Resizable>
  )
}

export { Example }
