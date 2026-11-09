<script lang="ts">
  import { TabsIndicator, TabsList } from "@ui-sdk/svelte/tabs"
  import { cn } from "cn"
  import type { ComponentProps, Snippet } from "svelte"

  let {
    class: className,
    children,
    ...rest
  }: ComponentProps<typeof TabsList> & {
    class?: string
    children?: Snippet
  } = $props()
</script>

<TabsList
  class={cn(
    "relative inline-flex h-8 w-fit items-center rounded-2xl bg-muted p-[3px] text-muted-foreground",
    className
  )}
  {...rest}
>
  {@render children?.()}
  <TabsIndicator
    class="pointer-events-none absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-2xl bg-background shadow-xs transition-[top,left,width,height] duration-300 ease-out data-[activation-direction=none]:transition-none motion-reduce:transition-none dark:bg-input/50"
  />
</TabsList>
