import { cn } from "cn"
import type { ComponentProps } from "react"

function Frame({
  variant = "raised",
  className,
  ...props
}: ComponentProps<"div"> & { variant?: "raised" | "flat" }) {
  return (
    <div
      data-variant={variant}
      className={cn(
        "rounded-frame bg-background ring-1 ring-foreground/15 dark:bg-foreground/[0.03] dark:ring-foreground/10",
        variant === "raised" &&
          "",
        className,
      )}
      {...props}
    />
  )
}

export { Frame }
