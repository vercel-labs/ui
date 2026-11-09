"use client"

import {
  DrawerBackdrop as DrawerBackdropPrimitive,
  DrawerContent as DrawerContentPrimitive,
  DrawerTitle as DrawerTitlePrimitive,
} from "@ui-sdk/react/drawer"
import { cn } from "cn"
import type { ComponentProps, ReactNode } from "react"

function DrawerContent({
  className,
  children,
  ...props
}: Omit<
  ComponentProps<typeof DrawerContentPrimitive>,
  "className" | "children"
> & {
  className?: string
  children?: ReactNode
}) {
  return (
    <>
      <DrawerBackdropPrimitive className="fixed inset-0 bg-black/30 supports-backdrop-filter:backdrop-blur-sm" />
      <DrawerContentPrimitive
        className={cn(
          "relative mx-auto flex max-h-[85dvh] w-full max-w-lg flex-col rounded-t-[min(var(--radius-4xl),24px)] bg-popover text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none after:absolute after:inset-x-0 after:top-full after:h-24 after:bg-inherit dark:ring-foreground/10",
          className
        )}
        {...props}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted"
        />
        {children}
      </DrawerContentPrimitive>
    </>
  )
}

function DrawerTitle({
  className,
  ...props
}: Omit<ComponentProps<typeof DrawerTitlePrimitive>, "className"> & {
  className?: string
}) {
  return (
    <DrawerTitlePrimitive
      className={cn("text-base font-medium", className)}
      {...props}
    />
  )
}

export { DrawerContent, DrawerTitle }
export { Drawer, DrawerClose, DrawerTrigger } from "@ui-sdk/react/drawer"
