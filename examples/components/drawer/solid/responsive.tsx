import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/solid/drawer"
import { createEffect, createSignal, Show } from "solid-js"

function createMediaQuery(query: string) {
  const [matches, setMatches] = createSignal(false)
  createEffect(
    () => 0,
    () => {
      const list = window.matchMedia(query)
      const update = () => setMatches(list.matches)
      update()
      list.addEventListener("change", update)
      return () => list.removeEventListener("change", update)
    },
  )
  return matches
}

function Example() {
  const isDesktop = createMediaQuery("(min-width: 768px)")

  return (
    <Show
      when={isDesktop()}
      fallback={
        <Drawer>
          <DrawerTrigger>Edit profile</DrawerTrigger>
          <DrawerBackdrop />
          <DrawerContent>
            <div data-slot="grip" aria-hidden="true" />
            <div data-slot="stack">
              <DrawerTitle>Edit profile</DrawerTitle>
              <DrawerDescription>Make changes to your profile here. Save when you're done.</DrawerDescription>
            </div>

            <ProfileFields />

            <div data-slot="stack">
              <DrawerClose data-variant="solid">Save changes</DrawerClose>
              <DrawerClose>Cancel</DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      }
    >
      <Dialog>
        <DialogTrigger>Edit profile</DialogTrigger>
        <DialogBackdrop />
        <DialogContent>
          <div data-slot="stack">
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Save when you're done.</DialogDescription>
          </div>
          <ProfileFields />
          <DialogClose data-variant="solid">Save changes</DialogClose>
        </DialogContent>
      </Dialog>
    </Show>
  )
}

function ProfileFields() {
  return (
    <div data-slot="stack">
      <label data-slot="label">
        Email
        <input type="email" value="shadcn@example.com" />
      </label>
      <label data-slot="label">
        Username
        <input value="@shadcn" />
      </label>
    </div>
  )
}

export { Example }
