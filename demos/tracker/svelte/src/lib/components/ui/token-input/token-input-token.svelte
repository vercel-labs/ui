<script lang="ts">
  import { TokenInputToken } from "@ui-sdk/svelte/token-input"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof TokenInputToken> & { class?: string } = $props()
</script>

<TokenInputToken
  class={cn(
    "inline-flex items-center rounded-2xl bg-input px-1.5 align-baseline font-medium data-selected:ring-3 data-selected:ring-ring/30 dark:bg-input/60",
    className
  )}
  {...rest}
/>
