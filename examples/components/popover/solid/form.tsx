import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { createSignal } from "solid-js"

function Example() {
  const [name, setName] = createSignal("Ada Lovelace")
  const [open, setOpen] = createSignal(false)
  const [saved, setSaved] = createSignal("")

  return (
    <>
      <Popover open={open()} onOpenChange={setOpen}>
        <PopoverTrigger>Edit profile</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Profile</PopoverTitle>
          <PopoverDescription>Your name appears on your posts.</PopoverDescription>
          <form
            data-slot="stack"
            onSubmit={(event) => {
              event.preventDefault()
              setSaved(name())
              setOpen(false)
            }}
          >
            <label data-slot="label">
              Name
              <input value={name()} onInput={(event) => setName(event.currentTarget.value)} />
            </label>
            <button type="submit" data-variant="solid">
              Save
            </button>
          </form>
        </PopoverContent>
      </Popover>
      <output data-slot="output">{saved() ? `Saved ${saved()}` : "Not saved yet"}</output>
    </>
  )
}

export { Example }
