<script lang="ts">
  import { CommandGroupLabel } from "@ui-sdk/svelte/command"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof CommandGroupLabel> & { class?: string } = $props()
</script>

<CommandGroupLabel
  class={cn(
    "px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground",
    className,
  )}
  {...rest}
/>
