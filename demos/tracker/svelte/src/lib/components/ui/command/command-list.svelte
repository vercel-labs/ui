<script lang="ts">
  import { CommandList } from "@ui-sdk/svelte/command"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof CommandList> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<CommandList
  class={cn(
    "max-h-80 min-h-0 scroll-py-1 overflow-y-auto overscroll-contain p-1",
    className
  )}
  {...rest}
/>
