import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/solid/drawer"
import { createSignal, For, Show } from "solid-js"

const modes = [
  { value: "true", label: "Modal" },
  { value: "trap-focus", label: "Trap focus" },
  { value: "false", label: "Non-modal" },
] as const

function Example() {
  const [mode, setMode] = createSignal<(typeof modes)[number]["value"]>("false")
  const [outside, setOutside] = createSignal(false)
  const modal = () => (mode() === "true" ? true : mode() === "false" ? false : "trap-focus")
  return (
    <div data-slot="stack">
      <fieldset data-slot="row">
        <legend>modal</legend>
        <For each={modes}>
          {(option) => (
            <label data-slot="label">
              <input
                type="radio"
                name="drawer-modal"
                checked={mode() === option.value}
                onChange={() => setMode(option.value)}
              />
              {option.label}
            </label>
          )}
        </For>
        <label data-slot="label">
          <input
            type="checkbox"
            checked={outside()}
            onChange={(event) => setOutside(event.currentTarget.checked)}
          />
          closeOnOutsidePress
        </label>
      </fieldset>
      <Drawer modal={modal()} closeOnOutsidePress={outside()}>
        <DrawerTrigger>Open notes</DrawerTrigger>
        <Show when={modal() === true}>
          <DrawerBackdrop />
        </Show>
        <DrawerContent>
          <DrawerTitle>Notes</DrawerTitle>
          <DrawerDescription>
            {modal() === false
              ? "The page stays usable. Tab leaves the notes, and Escape closes them while focus is inside."
              : modal() === true
                ? "The rest of the page is inert and doesn't scroll."
                : "Tab stays inside, and the page still scrolls and takes clicks."}
          </DrawerDescription>
          <textarea aria-label="Notes" value="Call the printer about the proofs." />
          <DrawerClose data-variant="solid">Done</DrawerClose>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export { Example }
