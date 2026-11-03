import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/solid/drawer"
import { createSignal } from "solid-js"

function Example() {
  const [profile, setProfile] = createSignal({ name: "Pedro Duarte", username: "@peduarte" })
  let summary: HTMLDivElement | undefined
  let form: HTMLFormElement | undefined
  let tries = 0

  async function save() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    tries++
    if (tries === 1) throw new Error("The server didn't answer.")
    const data = new FormData(form)
    setProfile({ name: String(data.get("name")), username: String(data.get("username")) })
  }

  return (
    <div data-slot="stack">
      <div ref={summary} tabindex={-1}>
        <div>{profile().name}</div>
        <div data-slot="hint">{profile().username}</div>
      </div>
      <Drawer>
        <DrawerTrigger>Edit profile</DrawerTrigger>
        <DrawerBackdrop />
        <DrawerContent keepMounted finalFocus={() => summary}>
          <div data-slot="grip" aria-hidden="true" />
          <div data-slot="stack">
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>Make changes to your profile here. Save when you're done.</DrawerDescription>
          </div>
          <form data-slot="stack" ref={form} onSubmit={(event) => event.preventDefault()}>
            <label data-slot="label">
              Name
              <input name="name" value={profile().name} />
            </label>
            <label data-slot="label">
              Username
              <input name="username" value={profile().username} />
            </label>
          </form>
          <div data-slot="stack">
            <DrawerClose data-variant="solid" action={save} value="save">
              {(state) =>
                state.pending ? "Saving…" : state.error ? "Couldn't save. Try again" : "Save changes"
              }
            </DrawerClose>
            <DrawerClose>Cancel</DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export { Example }
