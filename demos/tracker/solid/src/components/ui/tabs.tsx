import { TabsIndicator, TabsList as TabsListPrimitive, TabsTab as TabsTabPrimitive } from "@ui-sdk/solid/tabs"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"
import type { JSX } from "@solidjs/web"

function TabsList(
  props: Omit<ComponentProps<typeof TabsListPrimitive>, "class" | "children"> & {
    class?: string
    children?: JSX.Element
  },
) {
  const rest = omit(props, "class", "children")
  return (
    <TabsListPrimitive
      class={cn(
        "relative inline-flex h-8 w-fit items-center rounded-2xl bg-muted p-[3px] text-muted-foreground",
        props.class,
      )}
      {...rest}
    >
      {props.children}
      <TabsIndicator class="pointer-events-none absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-2xl bg-background shadow-xs transition-[top,left,width,height] duration-300 ease-out data-[activation-direction=none]:transition-none motion-reduce:transition-none dark:bg-input/50" />
    </TabsListPrimitive>
  )
}

function TabsTab(props: Omit<ComponentProps<typeof TabsTabPrimitive>, "class"> & { class?: string }) {
  const rest = omit(props, "class")
  return (
    <TabsTabPrimitive
      class={cn(
        "relative z-10 inline-flex h-6.5 cursor-default items-center justify-center gap-1.5 rounded-2xl px-2.5 text-sm font-medium whitespace-nowrap text-foreground/60 outline-none transition-[color,box-shadow] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-selected:text-foreground",
        props.class,
      )}
      {...rest}
    />
  )
}

export { TabsList, TabsTab }
export { Tabs, TabsPanel } from "@ui-sdk/solid/tabs"
