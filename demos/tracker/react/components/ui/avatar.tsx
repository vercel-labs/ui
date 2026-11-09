"use client"

import { Avatar as AvatarPrimitive, AvatarFallback } from "@ui-sdk/react/avatar"
import { cn } from "cn"

const sizes = {
  sm: "size-5 text-[10px]",
  default: "size-7 text-xs",
  lg: "size-10 text-sm",
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
}

function Avatar({
  name,
  size = "default",
  decorative,
  className,
}: {
  name: string
  size?: keyof typeof sizes
  decorative?: boolean
  className?: string
}) {
  return (
    <AvatarPrimitive
      aria-hidden={decorative || undefined}
      className={cn(
        "relative flex shrink-0 rounded-full select-none",
        sizes[size],
        className
      )}
    >
      <AvatarFallback className="flex size-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground">
        <span aria-hidden="true">{initials(name)}</span>
        {!decorative && <span className="sr-only">{name}</span>}
      </AvatarFallback>
    </AvatarPrimitive>
  )
}

export { Avatar }
