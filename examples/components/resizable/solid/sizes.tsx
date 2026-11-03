import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/solid/resizable"

function Example() {
  return (
    <Resizable>
      <ResizablePanel defaultSize="200px" minSize="160px" maxSize="320px">
        Navigation
      </ResizablePanel>
      <ResizableHandle aria-label="Resize navigation">
        <div />
      </ResizableHandle>
      <ResizablePanel minSize={30}>Content</ResizablePanel>
    </Resizable>
  )
}

export { Example }
