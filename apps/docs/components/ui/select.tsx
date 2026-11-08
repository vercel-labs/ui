"use client"

import { cn } from "cn"
import {
  SelectContent as SelectContentPrimitive,
  SelectGroupLabel as SelectGroupLabelPrimitive,
  SelectItem as SelectItemPrimitive,
  SelectItemIndicator,
  SelectSeparator as SelectSeparatorPrimitive,
  SelectTrigger as SelectTriggerPrimitive,
} from "@ui-sdk/react/select"
import { CheckIcon, ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

const triggers = {
  default:
    "flex h-8 w-full items-center justify-between gap-1.5 rounded-2xl border border-transparent bg-foreground/5 px-3 text-sm hover:bg-foreground/[0.07] focus-visible:border-ring",
  ghost:
    "-mx-1.5 inline-flex h-7 items-center gap-1 rounded-lg px-1.5 text-sm hover:bg-foreground/5 data-open:bg-foreground/5",
}

function SelectTrigger({
  variant = "default",
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof SelectTriggerPrimitive>, "className" | "children"> & {
  variant?: keyof typeof triggers
  className?: string
  children?: ReactNode
}) {
  return (
    <SelectTriggerPrimitive
      className={cn(
        "outline-none transition-[color,background-color,box-shadow] select-none focus-visible:ring-3 focus-visible:ring-ring/30 data-placeholder:text-muted-foreground",
        triggers[variant],
        className,
      )}
      {...props}
    >
      {children}
      {variant === "ghost" ? (
        <ChevronDownIcon className="size-3.5 shrink-0 text-subtle" />
      ) : (
        <ChevronsUpDownIcon className="size-3.5 shrink-0 text-subtle" />
      )}
    </SelectTriggerPrimitive>
  )
}

function SelectContent({
  className,
  ...props
}: Omit<ComponentProps<typeof SelectContentPrimitive>, "className"> & { className?: string }) {
  return (
    <SelectContentPrimitive
      className={cn(
        "max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 dark:ring-foreground/10",
        className,
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof SelectItemPrimitive>, "className" | "children"> & {
  className?: string
  children?: ReactNode
}) {
  return (
    <SelectItemPrimitive
      className={cn(
        "relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectItemIndicator className="absolute end-2 flex size-4 items-center justify-center">
        <CheckIcon className="size-4" />
      </SelectItemIndicator>
    </SelectItemPrimitive>
  )
}

function SelectGroupLabel({
  className,
  ...props
}: Omit<ComponentProps<typeof SelectGroupLabelPrimitive>, "className"> & { className?: string }) {
  return (
    <SelectGroupLabelPrimitive
      className={cn("px-2 pt-1.5 pb-1 text-[13px] text-subtle", className)}
      {...props}
    />
  )
}

function SelectSeparator({
  className,
  ...props
}: Omit<ComponentProps<typeof SelectSeparatorPrimitive>, "className"> & { className?: string }) {
  return <SelectSeparatorPrimitive className={cn("mx-2 my-1 h-px bg-border/70", className)} {...props} />
}

export { SelectContent, SelectGroupLabel, SelectItem, SelectSeparator, SelectTrigger }
export { Select, SelectGroup, SelectValue } from "@ui-sdk/react/select"
