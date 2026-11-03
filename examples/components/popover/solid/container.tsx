import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { createSignal } from "solid-js"

function Example() {
  const [container, setContainer] = createSignal<HTMLDivElement>()

  return (
    <div data-slot="stack">
      <Popover>
        <PopoverTrigger>Open in the box</PopoverTrigger>
        <PopoverContent container={container()}>
          <PopoverTitle>Portaled</PopoverTitle>
          <PopoverDescription>This popover is in the box below, in the DOM.</PopoverDescription>
        </PopoverContent>
      </Popover>
      <div data-slot="card">
        Container
        <div ref={setContainer} />
      </div>
    </div>
  )
}

export { Example }
