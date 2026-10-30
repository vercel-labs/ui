"use client"

import { PopoverContent as PopoverContentPrimitive } from "@ui-sdk/react/popover"
import { cn } from "cn"
import type { ComponentProps } from "react"

const popup =
  "origin-(--transform-origin) rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10"

function PopoverContent({
  className,
  ...props
}: Omit<ComponentProps<typeof PopoverContentPrimitive>, "className"> & { className?: string }) {
  return (
    <PopoverContentPrimitive
      sideOffset={8}
      className={cn("flex w-72 flex-col gap-3", popup, className)}
      {...props}
    />
  )
}

export { PopoverContent, popup }
export {
  Popover,
  PopoverClose,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
