"use client"

import {
  ComboboxChip as ComboboxChipPrimitive,
  ComboboxChipRemove,
  ComboboxChips as ComboboxChipsPrimitive,
  ComboboxContent as ComboboxContentPrimitive,
  ComboboxEmpty as ComboboxEmptyPrimitive,
  ComboboxInput as ComboboxInputPrimitive,
  ComboboxItem as ComboboxItemPrimitive,
  ComboboxItemIndicator,
  ComboboxLabel as ComboboxLabelPrimitive,
  ComboboxTrigger as ComboboxTriggerPrimitive,
} from "@ui-sdk/react/combobox"
import { cn } from "cn"
import { Check, ChevronDown, X } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

function ComboboxLabel({
  className,
  ...props
}: Omit<ComponentProps<typeof ComboboxLabelPrimitive>, "className"> & { className?: string }) {
  return <ComboboxLabelPrimitive className={cn("text-sm leading-none font-medium", className)} {...props} />
}

function ComboboxChips({
  className,
  ...props
}: Omit<ComponentProps<typeof ComboboxChipsPrimitive>, "className"> & { className?: string }) {
  return (
    <ComboboxChipsPrimitive
      className={cn(
        "relative flex min-h-8 w-full flex-wrap items-center gap-1 rounded-2xl border border-transparent bg-input/50 bg-clip-padding py-1 ps-1 pe-8 text-sm transition-[color,box-shadow] duration-200 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  value,
  label,
  className,
  children,
}: {
  value: string
  label: string
  className?: string
  children?: ReactNode
}) {
  return (
    <ComboboxChipPrimitive
      value={value}
      className={cn(
        "flex h-5.5 w-fit items-center gap-1 rounded-2xl bg-input ps-1.5 pe-0.5 text-xs font-medium whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        className,
      )}
    >
      {children}
      {label}
      <ComboboxChipRemove
        aria-label={`Remove ${label}`}
        className="-ms-0.5 flex size-4.5 cursor-default items-center justify-center rounded-full opacity-50 outline-none hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <X aria-hidden="true" className="size-3" />
      </ComboboxChipRemove>
    </ComboboxChipPrimitive>
  )
}

function ComboboxInput({
  className,
  ...props
}: Omit<ComponentProps<typeof ComboboxInputPrimitive>, "className"> & { className?: string }) {
  return (
    <ComboboxInputPrimitive
      className={cn(
        "h-6 min-w-8 flex-1 bg-transparent px-1.5 text-base outline-none placeholder:text-muted-foreground md:text-sm",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxTrigger({
  className,
  ...props
}: Omit<ComponentProps<typeof ComboboxTriggerPrimitive>, "className" | "children"> & { className?: string }) {
  return (
    <ComboboxTriggerPrimitive
      className={cn(
        "group absolute end-1 top-1 inline-flex size-6 cursor-default items-center justify-center rounded-xl text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <ChevronDown aria-hidden="true" className="size-4 transition-transform group-data-open:rotate-180" />
    </ComboboxTriggerPrimitive>
  )
}

function ComboboxContent({
  className,
  ...props
}: Omit<ComponentProps<typeof ComboboxContentPrimitive>, "className"> & { className?: string }) {
  return (
    <ComboboxContentPrimitive
      className={cn(
        "max-h-[min(18rem,var(--available-height))] w-(--anchor-width) min-w-44 origin-(--transform-origin) scroll-py-1 overflow-x-hidden overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxEmpty({
  className,
  ...props
}: Omit<ComponentProps<typeof ComboboxEmptyPrimitive>, "className"> & { className?: string }) {
  return (
    <ComboboxEmptyPrimitive
      className={cn("py-2 text-center text-sm text-muted-foreground empty:hidden", className)}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof ComboboxItemPrimitive>, "className" | "children"> & {
  className?: string
  children?: ReactNode
}) {
  return (
    <ComboboxItemPrimitive
      className={cn(
        "relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxItemIndicator className="absolute end-2 flex size-4 items-center justify-center">
        <Check aria-hidden="true" className="size-4" />
      </ComboboxItemIndicator>
    </ComboboxItemPrimitive>
  )
}

export {
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxTrigger,
}
export { Combobox, ComboboxList, ComboboxValue } from "@ui-sdk/react/combobox"
