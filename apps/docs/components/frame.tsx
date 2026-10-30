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
        "rounded-2xl bg-background ring-1 ring-foreground/[0.06] dark:bg-foreground/[0.03] dark:ring-foreground/10",
        variant === "raised" &&
          "shadow-[0_1px_1px_rgb(0_0_0/0.03),0_2px_2px_-1px_rgb(0_0_0/0.03),0_4px_6px_-3px_rgb(0_0_0/0.04)] dark:shadow-none",
        className,
      )}
      {...props}
    />
  )
}

export { Frame }
