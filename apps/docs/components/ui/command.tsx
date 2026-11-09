"use client"

import { cn } from "cn"
import {
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroupLabel as CommandGroupLabelPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandList as CommandListPrimitive,
} from "@ui-sdk/react/command"
import type { ComponentProps } from "react"

function CommandInput({
  className,
  ...props
}: Omit<ComponentProps<typeof CommandInputPrimitive>, "className"> & { className?: string }) {
  return (
    <div className="flex items-center border-b border-border/60 px-4">
      <CommandInputPrimitive
        className={cn(
          "h-12 w-full min-w-0 bg-transparent text-sm outline-none pointer-coarse:text-base placeholder:text-subtle",
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
      className={cn(
        "min-h-0 flex-1 scroll-py-1.5 overflow-y-auto overscroll-contain p-1.5 transition-opacity aria-busy:opacity-60",
        className,
      )}
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
      className={cn("px-2.5 pt-2 pb-1 font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase", className)}
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
        "flex min-h-8 cursor-default items-center gap-2.5 rounded-[calc(var(--radius-3xl)-0.375rem)] px-2.5 py-1.5 outline-none select-none data-highlighted:bg-foreground/5 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4",
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
      className={cn("py-10 text-center text-sm text-subtle empty:hidden", className)}
      {...props}
    />
  )
}

export { CommandEmpty, CommandGroupLabel, CommandInput, CommandItem, CommandList }
export { Command, CommandGroup } from "@ui-sdk/react/command"
