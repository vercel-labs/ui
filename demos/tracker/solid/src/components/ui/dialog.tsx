import {
  DialogBackdrop as DialogBackdropPrimitive,
  DialogContent as DialogContentPrimitive,
  DialogDescription as DialogDescriptionPrimitive,
  DialogTitle as DialogTitlePrimitive,
} from "@ui-sdk/solid/dialog"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"

function DialogBackdrop(
  props: Omit<ComponentProps<typeof DialogBackdropPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <DialogBackdropPrimitive
      class={cn(
        "fixed inset-0 bg-black/30 transition-opacity duration-100 supports-backdrop-filter:backdrop-blur-sm data-starting-style:opacity-0 data-ending-style:opacity-0",
        props.class
      )}
      {...rest}
    />
  )
}

function DialogContent(
  props: Omit<ComponentProps<typeof DialogContentPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <DialogContentPrimitive
      class={cn(
        "fixed top-1/2 left-1/2 grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-6 rounded-[min(var(--radius-4xl),24px)] bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 sm:max-w-md motion-reduce:transition-none dark:ring-foreground/10",
        props.class
      )}
      {...rest}
    />
  )
}

function DialogTitle(
  props: Omit<ComponentProps<typeof DialogTitlePrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <DialogTitlePrimitive
      class={cn("text-base leading-none font-medium", props.class)}
      {...rest}
    />
  )
}

function DialogDescription(
  props: Omit<ComponentProps<typeof DialogDescriptionPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <DialogDescriptionPrimitive
      class={cn("text-sm text-muted-foreground", props.class)}
      {...rest}
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
} from "@ui-sdk/solid/dialog"
