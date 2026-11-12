"use client"

import { iconTooltip } from "@/components/icon-tooltip"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "cn"
import { RotateCcwIcon } from "lucide-react"

function ResetButton({ className }: { className?: string }) {
  return (
    <TooltipTrigger
      controller={iconTooltip}
      payload="Reset preview"
      aria-label="Reset preview"
      onClick={(event) =>
        event.currentTarget
          .closest("figure")
          ?.dispatchEvent(new Event("example-reset"))
      }
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-frame-control text-subtle outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30",
        className
      )}
    >
      <RotateCcwIcon className="size-3.5" />
    </TooltipTrigger>
  )
}

export { ResetButton }
