"use client"

import * as React from "react"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer"

function useMediaQuery(query: string) {
  return React.useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

function Example() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
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
    )
  }

  return (
    <Drawer>
      <DrawerTrigger>Edit profile</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent>
        <div data-slot="grip" aria-hidden />
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
  )
}

function ProfileFields() {
  return (
    <div data-slot="stack">
      <label data-slot="label">
        Email
        <input type="email" defaultValue="shadcn@example.com" />
      </label>
      <label data-slot="label">
        Username
        <input defaultValue="@shadcn" />
      </label>
    </div>
  )
}

export { Example }
