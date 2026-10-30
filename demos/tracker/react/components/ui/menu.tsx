"use client"

import {
  MenuContent as MenuContentPrimitive,
  MenuGroupLabel as MenuGroupLabelPrimitive,
  MenuItem as MenuItemPrimitive,
  MenuItemIcon as MenuItemIconPrimitive,
  MenuRadioItem as MenuRadioItemPrimitive,
  MenuSeparator as MenuSeparatorPrimitive,
  MenuSubContent as MenuSubContentPrimitive,
  MenuSubTrigger as MenuSubTriggerPrimitive,
  MenuItemIndicator,
} from "@ui-sdk/react/menu"
import { cn } from "cn"
import { Check, ChevronRight } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

const item =
  "group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4"

const content =
  "max-h-(--available-height) min-w-44 origin-(--transform-origin) overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10"

function MenuContent<Payload = unknown>({
  className,
  ...props
}: Omit<ComponentProps<typeof MenuContentPrimitive<Payload>>, "className"> & { className?: string }) {
  return <MenuContentPrimitive<Payload> sideOffset={6} className={cn(content, className)} {...props} />
}

function MenuSubContent({
  className,
  ...props
}: Omit<ComponentProps<typeof MenuSubContentPrimitive>, "className"> & { className?: string }) {
  return <MenuSubContentPrimitive className={cn(content, className)} {...props} />
}

function MenuSubTrigger({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof MenuSubTriggerPrimitive>, "className" | "children"> & {
  className?: string
  children?: ReactNode
}) {
  return (
    <MenuSubTriggerPrimitive className={cn(item, "data-open:bg-accent", className)} {...props}>
      {children}
      <ChevronRight aria-hidden="true" className="ms-auto text-muted-foreground rtl:rotate-180" />
    </MenuSubTriggerPrimitive>
  )
}

function MenuItem({
  variant = "default",
  className,
  ...props
}: Omit<ComponentProps<typeof MenuItemPrimitive>, "className"> & {
  variant?: "default" | "destructive"
  className?: string
}) {
  return (
    <MenuItemPrimitive
      className={cn(
        item,
        variant === "destructive" &&
          "text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive",
        className,
      )}
      {...props}
    />
  )
}

function MenuRadioItem({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof MenuRadioItemPrimitive>, "className" | "children"> & {
  className?: string
  children?: ReactNode
}) {
  return (
    <MenuRadioItemPrimitive className={cn(item, "pe-8", className)} {...props}>
      {children}
      <MenuItemIndicator className="absolute end-2 flex size-4 items-center justify-center">
        <Check className="size-4" />
      </MenuItemIndicator>
    </MenuRadioItemPrimitive>
  )
}

function MenuItemIcon({
  className,
  ...props
}: Omit<ComponentProps<typeof MenuItemIconPrimitive>, "className"> & { className?: string }) {
  return (
    <MenuItemIconPrimitive
      className={cn("flex text-muted-foreground group-data-highlighted:text-current", className)}
      {...props}
    />
  )
}

function MenuGroupLabel({
  className,
  ...props
}: Omit<ComponentProps<typeof MenuGroupLabelPrimitive>, "className"> & { className?: string }) {
  return (
    <MenuGroupLabelPrimitive
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

function MenuSeparator({
  className,
  ...props
}: Omit<ComponentProps<typeof MenuSeparatorPrimitive>, "className"> & { className?: string }) {
  return <MenuSeparatorPrimitive className={cn("-mx-1 my-1 h-px bg-border/50", className)} {...props} />
}

export {
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuRadioItem,
  MenuSeparator,
  MenuSubContent,
  MenuSubTrigger,
}
export {
  createMenuController,
  Menu,
  MenuGroup,
  MenuRadioGroup,
  MenuShortcut,
  MenuSub,
  MenuTrigger,
} from "@ui-sdk/react/menu"
