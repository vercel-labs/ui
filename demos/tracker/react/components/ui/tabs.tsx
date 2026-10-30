"use client"

import { TabsIndicator, TabsList as TabsListPrimitive, TabsTab as TabsTabPrimitive } from "@ui-sdk/react/tabs"
import { cn } from "cn"
import type { ComponentProps, ReactNode } from "react"

function TabsList({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof TabsListPrimitive>, "className" | "children"> & {
  className?: string
  children?: ReactNode
}) {
  return (
    <TabsListPrimitive
      className={cn(
        "relative inline-flex h-8 w-fit items-center rounded-2xl bg-muted p-[3px] text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <TabsIndicator className="pointer-events-none absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-2xl bg-background shadow-xs transition-[top,left,width,height] duration-300 ease-out data-[activation-direction=none]:transition-none motion-reduce:transition-none dark:bg-input/50" />
    </TabsListPrimitive>
  )
}

function TabsTab({
  className,
  ...props
}: Omit<ComponentProps<typeof TabsTabPrimitive>, "className"> & { className?: string }) {
  return (
    <TabsTabPrimitive
      className={cn(
        "relative z-10 inline-flex h-6.5 cursor-default items-center justify-center gap-1.5 rounded-2xl px-2.5 text-sm font-medium whitespace-nowrap text-foreground/60 outline-none transition-[color,box-shadow] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-selected:text-foreground",
        className,
      )}
      {...props}
    />
  )
}

export { TabsList, TabsTab }
export { Tabs, TabsPanel } from "@ui-sdk/react/tabs"
