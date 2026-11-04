"use client"

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import { cn } from "cn"
import { CircleHelpIcon } from "lucide-react"

function StylingNote({ packageName, className }: { packageName: string; className?: string }) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="About these examples"
        className={cn(
          "inline-flex size-[30px] shrink-0 items-center justify-center rounded-full text-subtle outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted data-open:text-foreground",
          className,
        )}
      >
        <CircleHelpIcon className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={6}
        className="w-80 max-w-[calc(100vw-2rem)] origin-(--transform-origin) rounded-xl bg-popover p-3 text-sm text-popover-foreground shadow-lg ring-1 ring-border/60 transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0"
      >
        <PopoverTitle className="font-medium">Just the essentials</PopoverTitle>
        <PopoverDescription className="mt-1 leading-relaxed text-muted-foreground">
          <code className="font-mono text-xs">{packageName}</code> handles behavior, not looks. These examples
          add just enough CSS to show how each component works, so you can see exactly what you're starting
          from.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  )
}

export { StylingNote }
