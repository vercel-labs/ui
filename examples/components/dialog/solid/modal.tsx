import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { createSignal, For, Show } from "solid-js"

const modes = [
  { value: "true", label: "Modal" },
  { value: "trap-focus", label: "Trap focus" },
  { value: "false", label: "Non-modal" },
] as const

const notes = {
  true: "The rest of the page is inert and doesn't scroll.",
  "trap-focus": "Tab stays inside, and the page still scrolls and takes clicks.",
  false: "The page stays usable. Tab leaves the notes, and Escape closes them while focus is inside.",
}

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
                name="modal"
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
      <Dialog modal={modal()} closeOnOutsidePress={outside()}>
        <DialogTrigger>Open notes</DialogTrigger>
        <Show when={modal() === true}>
          <DialogBackdrop />
        </Show>
        <DialogContent>
          <div data-slot="stack">
            <DialogTitle>Notes</DialogTitle>
            <DialogDescription>{notes[mode()]}</DialogDescription>
          </div>
          <textarea aria-label="Notes" value="Call the printer about the proofs." />
          <DialogClose>Done</DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { Example }
