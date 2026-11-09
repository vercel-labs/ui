<script lang="ts">
  import { cn } from "cn"
  import type { HTMLAttributes } from "svelte/elements"

  let {
    class: className,
    children,
    ...rest
  }: HTMLAttributes<HTMLSpanElement> = $props()
</script>

<span
  class={cn(
    "inline-flex h-5 shrink-0 items-center gap-1.5 rounded-2xl border border-border px-2 text-xs font-medium whitespace-nowrap",
    className
  )}
  {...rest}
>
  {@render children?.()}
</span>
