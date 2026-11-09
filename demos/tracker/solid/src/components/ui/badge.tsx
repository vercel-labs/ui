import { cn } from "cn"
import type { JSX } from "@solidjs/web"
import { omit } from "solid-js"

function Badge(props: JSX.HTMLAttributes<HTMLSpanElement>) {
  const rest = omit(props, "class")
  return (
    <span
      {...rest}
      class={cn(
        "inline-flex h-5 shrink-0 items-center gap-1.5 rounded-2xl border border-border px-2 text-xs font-medium whitespace-nowrap",
        props.class
      )}
    />
  )
}

export { Badge }
