<script lang="ts">
  import { ToggleGroup } from "@ui-sdk/svelte/toggle"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof ToggleGroup> & { class?: string } = $props()
</script>

<ToggleGroup
  class={cn(
    "flex w-fit items-center gap-0.5 rounded-2xl bg-muted p-0.5",
    className
  )}
  {...rest}
/>
