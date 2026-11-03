import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/solid/resizable"

function Example() {
  return (
    <Resizable step={5} largeStep={25}>
      <ResizablePanel defaultSize={50} minSize={10}>
        Left
      </ResizablePanel>
      <ResizableHandle aria-label="Resize left" />
      <ResizablePanel defaultSize={50} minSize={10}>
        Right
      </ResizablePanel>
    </Resizable>
  )
}

export { Example }
