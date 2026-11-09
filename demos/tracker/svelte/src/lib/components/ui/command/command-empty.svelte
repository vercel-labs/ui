<script lang="ts">
  import { CommandEmpty } from "@ui-sdk/svelte/command"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof CommandEmpty> & { class?: string } = $props()
</script>

<CommandEmpty
  class={cn(
    "py-10 text-center text-sm text-muted-foreground empty:hidden",
    className
  )}
  {...rest}
/>
