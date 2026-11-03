import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { createSignal, For } from "solid-js"

const modes = [
  { label: "Non-modal", modal: false },
  { label: "Trap focus", modal: "trap-focus" },
  { label: "Modal", modal: true },
] as const

function Example() {
  const [clicks, setClicks] = createSignal(0)

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <For each={modes}>
          {(mode) => (
            <Popover modal={mode.modal}>
              <PopoverTrigger>{mode.label}</PopoverTrigger>
              <PopoverContent>
                <PopoverTitle>{mode.label}</PopoverTitle>
                <PopoverDescription>Press Tab, then click the box below.</PopoverDescription>
                <PopoverClose>Close</PopoverClose>
              </PopoverContent>
            </Popover>
          )}
        </For>
      </div>
      <button type="button" onClick={() => setClicks(clicks() + 1)}>
        Clicked {clicks()} {clicks() === 1 ? "time" : "times"}. Open a popover, then click here.
      </button>
    </div>
  )
}

export { Example }
