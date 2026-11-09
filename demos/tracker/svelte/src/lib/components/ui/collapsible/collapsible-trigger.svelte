<script lang="ts">
  import { ChevronRight } from "@lucide/svelte"
  import { CollapsibleTrigger } from "@ui-sdk/svelte/collapsible"
  import { cn } from "cn"
  import type { ComponentProps, Snippet } from "svelte"

  let {
    class: className,
    children,
    ...rest
  }: ComponentProps<typeof CollapsibleTrigger> & {
    class?: string
    children?: Snippet
  } = $props()
</script>

<CollapsibleTrigger
  class={cn(
    "group flex h-7 cursor-default items-center gap-1 rounded-xl px-1.5 text-sm font-medium outline-none select-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30",
    className
  )}
  {...rest}
>
  <ChevronRight
    aria-hidden="true"
    class="size-4 text-muted-foreground transition-transform group-data-open:rotate-90 motion-reduce:transition-none rtl:rotate-180 rtl:group-data-open:rotate-90"
  />
  {@render children?.()}
</CollapsibleTrigger>
