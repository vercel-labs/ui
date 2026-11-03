"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "cn"
import { RotateCcwIcon } from "lucide-react"

function ResetButton({ className }: { className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        aria-label="Reset preview"
        onClick={(event) => event.currentTarget.closest("figure")?.dispatchEvent(new Event("example-reset"))}
        className={cn(
          "inline-flex size-[30px] shrink-0 items-center justify-center rounded-[8px] text-subtle outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30",
          className,
        )}
      >
        <RotateCcwIcon className="size-3.5" />
      </TooltipTrigger>
      <TooltipContent>Reset preview</TooltipContent>
    </Tooltip>
  )
}

export { ResetButton }
