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
}: Omit<ComponentProps<typeof TabsListPrimitive>, "className"> & { className?: string }) {
  return (
    <TabsListPrimitive
      className={cn(
        "inline-flex max-w-full min-w-0 items-center gap-0.5 overflow-x-auto scrollbar-none rounded-[8px] bg-muted p-[3px]",
        className,
      )}
      {...props}
    />
  )
}

function TabsTab({
  className,
  ...props
}: Omit<ComponentProps<typeof TabsTabPrimitive>, "className"> & { className?: string }) {
  return (
    <TabsTabPrimitive
      className={cn(
        "group/tabs-tab inline-flex h-[26px] shrink-0 items-center rounded-[5px] px-3 text-[13px] font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors select-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-selected:bg-background data-selected:text-foreground data-selected:shadow-[0_1px_2px_rgb(0_0_0/0.05)] data-selected:ring-1 data-selected:ring-border dark:data-selected:bg-foreground/[0.1]",
        className,
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
      render={({ hidden, ...rest }) => <div {...rest} data-inactive={hidden ? "" : undefined} />}
    />
  )
}

export { TabsList, TabsStackedPanel, TabsTab }
export { Tabs, TabsPanel } from "@ui-sdk/react/tabs"
