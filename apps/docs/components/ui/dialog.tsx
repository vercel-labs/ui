"use client"

import { cn } from "cn"
import {
  DialogBackdrop,
  DialogContent as DialogContentPrimitive,
} from "@ui-sdk/react/dialog"
import type { ComponentProps } from "react"

const backdrop =
  "fixed inset-0 bg-black/20 transition-opacity duration-150 supports-backdrop-filter:backdrop-blur-[2px] data-starting-style:opacity-0 data-ending-style:opacity-0 dark:bg-black/50"

function DialogContent({
  instant,
  className,
  backdropClassName,
  ...props
}: Omit<ComponentProps<typeof DialogContentPrimitive>, "className"> & {
  instant?: boolean
  className?: string
  backdropClassName?: string
}) {
  return (
    <>
      <DialogBackdrop
        className={cn(
          instant ? "fixed inset-0 bg-black/20 dark:bg-black/50" : backdrop,
          backdropClassName
        )}
      />
      <DialogContentPrimitive
        className={cn(
          "fixed top-[12vh] left-1/2 flex max-h-[min(32rem,76vh)] w-[calc(100%-3rem)] max-w-xl sm:w-[calc(100%-4rem)] -translate-x-1/2 flex-col overflow-hidden rounded-3xl bg-popover text-sm text-popover-foreground shadow-2xl ring-1 ring-foreground outline-none",
          !instant &&
            "transition-[opacity,scale] duration-150 data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-ending-style:scale-[0.98] data-ending-style:opacity-0",
          className
        )}
        {...props}
      />
    </>
  )
}

export { DialogContent }
export {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
