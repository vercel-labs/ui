"use client"

import * as React from "react"
import {
  Collapsible as CollapsiblePrimitive,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/react/collapsible"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"
import { Frame } from "./frame"

function Collapsible({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Frame className={cn("my-5 overflow-hidden", className)}>
      <CollapsiblePrimitive>
        <CollapsibleTrigger className="group flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-start text-sm font-medium outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-inset">
          {title}
          <ChevronDownIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-subtle transition-transform duration-200 group-data-open:rotate-180 motion-reduce:transition-none"
          />
        </CollapsibleTrigger>
        <CollapsiblePanel
          hiddenUntilFound
          className="border-t border-border/60 px-4 [&>[data-code-frame]]:-mx-4 [&>[data-code-frame]]:my-0 [&>[data-code-frame]]:rounded-none [&>[data-code-frame]]:bg-transparent [&>[data-code-frame]]:shadow-none [&>[data-code-frame]]:ring-0"
        >
          {children}
        </CollapsiblePanel>
      </CollapsiblePrimitive>
    </Frame>
  )
}

export { Collapsible }
