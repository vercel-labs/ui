<script lang="ts">
  import { ChevronDown } from "@lucide/svelte"
  import {
    SelectTrigger,
    SelectValue,
    SelectValueIcon,
  } from "@ui-sdk/svelte/select"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof SelectTrigger> {
    icon?: boolean
    class?: string
  }

  let { icon = false, class: className, ...rest }: Props = $props()
</script>

<SelectTrigger
  class={cn(
    "flex h-8 w-full min-w-0 cursor-default items-center justify-between gap-1.5 rounded-2xl border border-transparent bg-input/50 px-3 text-sm whitespace-nowrap outline-none select-none transition-[color,box-shadow] duration-200 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-placeholder:text-muted-foreground data-disabled:opacity-50 motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0",
    className
  )}
  {...rest}
>
  {#if icon}
    <SelectValueIcon class="flex text-muted-foreground" />
  {/if}
  <SelectValue class="min-w-0 flex-1 truncate text-start" />
  <ChevronDown aria-hidden="true" class="text-muted-foreground" />
</SelectTrigger>
