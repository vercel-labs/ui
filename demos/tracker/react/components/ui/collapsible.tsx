"use client"

import {
  CollapsiblePanel as CollapsiblePanelPrimitive,
  CollapsibleTrigger as CollapsibleTriggerPrimitive,
} from "@ui-sdk/react/collapsible"
import { cn } from "cn"
import { ChevronRight } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

function CollapsibleTrigger({
  className,
  children,
  ...props
}: Omit<
  ComponentProps<typeof CollapsibleTriggerPrimitive>,
  "className" | "children"
> & {
  className?: string
  children?: ReactNode
}) {
  return (
    <CollapsibleTriggerPrimitive
      className={cn(
        "group flex h-7 cursor-default items-center gap-1 rounded-xl px-1.5 text-sm font-medium outline-none select-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30",
        className
      )}
      {...props}
    >
      <ChevronRight
        aria-hidden="true"
        className="size-4 text-muted-foreground transition-transform group-data-open:rotate-90 motion-reduce:transition-none rtl:rotate-180 rtl:group-data-open:rotate-90"
      />
      {children}
    </CollapsibleTriggerPrimitive>
  )
}

function CollapsiblePanel({
  className,
  ...props
}: Omit<ComponentProps<typeof CollapsiblePanelPrimitive>, "className"> & {
  className?: string
}) {
  return (
    <CollapsiblePanelPrimitive
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

export { CollapsiblePanel, CollapsibleTrigger }
export { Collapsible } from "@ui-sdk/react/collapsible"
