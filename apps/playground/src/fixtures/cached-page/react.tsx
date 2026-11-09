import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui-sdk/react/alert-dialog"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { presentationOption } from "tests/fixtures/presentation.ts"

// Two pages under <Activity>, each inside an element. The profile page's
// popup leaves for the other page while open, the way a link in it would.
// One modal popup, picked with ?popup=dialog|alert-dialog|drawer|popover,
// rendered in place or into ?container=id, and as a sheet with
// ?presentation=sheet where it can be one.
const params = new URLSearchParams(location.search)
const container = params.has("container")
  ? document.getElementById(params.get("container")!)
  : undefined
const popup = params.get("popup") ?? "dialog"

// The popup's title, a field to type in, a way to leave the page, and Close.
function Fields({
  Title,
  Close,
  onLeave,
}: {
  Title: React.ElementType
  Close: React.ElementType
  onLeave: () => void
}) {
  return (
    <>
      <Title className="title">Edit profile</Title>
      <label className="field">
        Name
        <input />
      </label>
      <div className="actions">
        <button onClick={onLeave}>Leave page</button>
        <Close>Close</Close>
      </div>
    </>
  )
}

function ProfilePage({ onLeave }: { onLeave: () => void }) {
  if (popup === "alert-dialog") {
    return (
      <AlertDialog container={container}>
        <AlertDialogTrigger>Edit profile</AlertDialogTrigger>
        <AlertDialogBackdrop className="dialog-backdrop" />
        <AlertDialogContent className="dialog">
          <Fields
            Title={AlertDialogTitle}
            Close={AlertDialogClose}
            onLeave={onLeave}
          />
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  if (popup === "drawer") {
    return (
      <Drawer container={container}>
        <DrawerTrigger>Edit profile</DrawerTrigger>
        <DrawerBackdrop className="dialog-backdrop" />
        <DrawerContent className="drawer">
          <Fields Title={DrawerTitle} Close={DrawerClose} onLeave={onLeave} />
        </DrawerContent>
      </Drawer>
    )
  }
  if (popup === "popover") {
    return (
      <Popover container={container} modal {...presentationOption()}>
        <PopoverTrigger>Edit profile</PopoverTrigger>
        <PopoverContent className="popup">
          <Fields Title={PopoverTitle} Close={PopoverClose} onLeave={onLeave} />
        </PopoverContent>
      </Popover>
    )
  }
  return (
    <Dialog container={container} {...presentationOption()}>
      <DialogTrigger>Edit profile</DialogTrigger>
      <DialogBackdrop className="dialog-backdrop" />
      <DialogContent className="dialog">
        <Fields Title={DialogTitle} Close={DialogClose} onLeave={onLeave} />
      </DialogContent>
    </Dialog>
  )
}

function Fixture() {
  const [page, setPage] = React.useState<"profile" | "other">("profile")
  return (
    <div className="fixture">
      <button>Before</button>
      <React.Activity mode={page === "profile" ? "visible" : "hidden"}>
        <section>
          <ProfilePage onLeave={() => setPage("other")} />
        </section>
      </React.Activity>
      <React.Activity mode={page === "other" ? "visible" : "hidden"}>
        <section>
          <button onClick={() => setPage("profile")}>Back to profile</button>
        </section>
      </React.Activity>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { mount }
