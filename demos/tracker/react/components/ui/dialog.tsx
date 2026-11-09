"use client"

import {
  DialogBackdrop as DialogBackdropPrimitive,
  DialogContent as DialogContentPrimitive,
  DialogDescription as DialogDescriptionPrimitive,
  DialogTitle as DialogTitlePrimitive,
} from "@ui-sdk/react/dialog"
import { cn } from "cn"
import type { ComponentProps } from "react"

function DialogBackdrop({
  className,
  ...props
}: Omit<ComponentProps<typeof DialogBackdropPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <DialogBackdropPrimitive
      className={cn(
        "fixed inset-0 bg-black/30 transition-opacity duration-100 supports-backdrop-filter:backdrop-blur-sm data-starting-style:opacity-0 data-ending-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  ...props
}: Omit<ComponentProps<typeof DialogContentPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <DialogContentPrimitive
      className={cn(
        "fixed top-1/2 left-1/2 grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-6 rounded-[min(var(--radius-4xl),24px)] bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 sm:max-w-md motion-reduce:transition-none dark:ring-foreground/10",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: Omit<ComponentProps<typeof DialogTitlePrimitive>, "className"> & {
  className?: string
}) {
  return (
    <DialogTitlePrimitive
      className={cn("text-base leading-none font-medium", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: Omit<ComponentProps<typeof DialogDescriptionPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <DialogDescriptionPrimitive
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export { DialogBackdrop, DialogContent, DialogDescription, DialogTitle }
export {
  createDialogController,
  Dialog,
  DialogClose,
  DialogShortcut,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
