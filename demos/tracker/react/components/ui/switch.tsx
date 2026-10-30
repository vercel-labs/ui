"use client"

import { Switch as SwitchPrimitive, SwitchThumb } from "@ui-sdk/react/switch"
import { cn } from "cn"
import type { ComponentProps } from "react"

function Switch({
  className,
  ...props
}: Omit<ComponentProps<typeof SwitchPrimitive>, "className" | "children"> & { className?: string }) {
  return (
    <SwitchPrimitive
      className={cn(
        "relative inline-flex h-5 w-8 shrink-0 cursor-default items-center rounded-2xl border-2 border-transparent bg-input/90 outline-none transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:bg-primary data-disabled:opacity-50 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <SwitchThumb className="pointer-events-none block size-4 rounded-2xl bg-background shadow-sm transition-transform data-checked:translate-x-[calc(100%-4px)] rtl:data-checked:-translate-x-[calc(100%-4px)] motion-reduce:transition-none" />
    </SwitchPrimitive>
  )
}

export { Switch }
