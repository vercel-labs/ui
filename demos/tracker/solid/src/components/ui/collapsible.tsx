import {
  CollapsiblePanel as CollapsiblePanelPrimitive,
  CollapsibleTrigger as CollapsibleTriggerPrimitive,
} from "@ui-sdk/solid/collapsible"
import { cn } from "cn"
import { ChevronRight } from "@/components/icons"
import { omit, type ComponentProps } from "solid-js"
import type { JSX } from "@solidjs/web"

function CollapsibleTrigger(
  props: Omit<
    ComponentProps<typeof CollapsibleTriggerPrimitive>,
    "class" | "children"
  > & {
    class?: string
    children?: JSX.Element
  }
) {
  const rest = omit(props, "class", "children")
  return (
    <CollapsibleTriggerPrimitive
      class={cn(
        "group flex h-7 cursor-default items-center gap-1 rounded-xl px-1.5 text-sm font-medium outline-none select-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30",
        props.class
      )}
      {...rest}
    >
      <ChevronRight
        aria-hidden="true"
        class="size-4 text-muted-foreground transition-transform group-data-open:rotate-90 motion-reduce:transition-none rtl:rotate-180 rtl:group-data-open:rotate-90"
      />
      {props.children}
    </CollapsibleTriggerPrimitive>
  )
}

function CollapsiblePanel(
  props: Omit<ComponentProps<typeof CollapsiblePanelPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <CollapsiblePanelPrimitive
      class={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none",
        props.class
      )}
      {...rest}
    />
  )
}

export { CollapsiblePanel, CollapsibleTrigger }
export { Collapsible } from "@ui-sdk/solid/collapsible"
