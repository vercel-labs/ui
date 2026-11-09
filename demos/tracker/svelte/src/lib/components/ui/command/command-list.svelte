<script lang="ts">
  import { CommandList } from "@ui-sdk/svelte/command"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof CommandList> & { class?: string } = $props()
</script>

<CommandList
  class={cn(
    "max-h-80 min-h-0 scroll-py-1 overflow-y-auto overscroll-contain p-1",
    className
  )}
  {...rest}
/>
