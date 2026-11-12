"use client"

import { cn } from "cn"
import {
  TabsList as TabsListPrimitive,
  TabsPanel as TabsPanelPrimitive,
  TabsTab as TabsTabPrimitive,
} from "@ui-sdk/react/tabs"
import type { ComponentProps } from "react"

function TabsList({
  className,
  ...props
}: Omit<ComponentProps<typeof TabsListPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <TabsListPrimitive
      className={cn(
        "inline-flex max-w-full min-w-0 items-center gap-1 overflow-x-auto scrollbar-none",
        className
      )}
      {...props}
    />
  )
}

function TabsTab({
  className,
  ...props
}: Omit<ComponentProps<typeof TabsTabPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <TabsTabPrimitive
      className={cn(
        "group/tabs-tab inline-flex h-7 shrink-0 items-center border border-transparent px-2.5 font-mono text-[11px] tracking-[0.06em] whitespace-nowrap text-muted-foreground uppercase outline-none transition-colors select-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue data-selected:border-foreground data-selected:text-foreground",
        className
      )}
      {...props}
    />
  )
}

// A panel that stays in layout while inactive, hidden with visibility instead
// of `hidden`, so panels stacked in one grid cell size to the tallest.
function TabsStackedPanel(props: ComponentProps<typeof TabsPanelPrimitive>) {
  return (
    <TabsPanelPrimitive
      {...props}
      render={({ hidden, ...rest }) => (
        <div {...rest} data-inactive={hidden ? "" : undefined} />
      )}
    />
  )
}

export { TabsList, TabsStackedPanel, TabsTab }
export { Tabs, TabsPanel } from "@ui-sdk/react/tabs"
