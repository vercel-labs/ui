import { cn } from "cn"
import type { ComponentProps } from "react"

function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1.5 rounded-2xl border border-border px-2 text-xs font-medium whitespace-nowrap",
        className
      )}
      {...props}
    />
  )
}

export { Badge }
