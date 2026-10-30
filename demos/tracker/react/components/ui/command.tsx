"use client"

import {
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroupLabel as CommandGroupLabelPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandItemIcon as CommandItemIconPrimitive,
  CommandList as CommandListPrimitive,
} from "@ui-sdk/react/command"
import { cn } from "cn"
import { Search } from "lucide-react"
import type { ComponentProps } from "react"

function CommandInput({
  className,
  ...props
}: Omit<ComponentProps<typeof CommandInputPrimitive>, "className"> & { className?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4">
      <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      <CommandInputPrimitive
        className={cn(
          "h-12 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm",
          className,
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: Omit<ComponentProps<typeof CommandListPrimitive>, "className"> & { className?: string }) {
  return (
    <CommandListPrimitive
      className={cn("max-h-80 min-h-0 scroll-py-1 overflow-y-auto overscroll-contain p-1", className)}
      {...props}
    />
  )
}

function CommandGroupLabel({
  className,
  ...props
}: Omit<ComponentProps<typeof CommandGroupLabelPrimitive>, "className"> & { className?: string }) {
  return (
    <CommandGroupLabelPrimitive
      className={cn("px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: Omit<ComponentProps<typeof CommandItemPrimitive>, "className"> & { className?: string }) {
  return (
    <CommandItemPrimitive
      className={cn(
        "group flex min-h-8 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

function CommandItemIcon({
  className,
  ...props
}: Omit<ComponentProps<typeof CommandItemIconPrimitive>, "className"> & { className?: string }) {
  return (
    <CommandItemIconPrimitive
      className={cn(
        "flex text-muted-foreground group-data-highlighted:text-current [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: Omit<ComponentProps<typeof CommandEmptyPrimitive>, "className"> & { className?: string }) {
  return (
    <CommandEmptyPrimitive
      className={cn("py-10 text-center text-sm text-muted-foreground empty:hidden", className)}
      {...props}
    />
  )
}

export { CommandEmpty, CommandGroupLabel, CommandInput, CommandItem, CommandItemIcon, CommandList }
export { Command, CommandGroup } from "@ui-sdk/react/command"
