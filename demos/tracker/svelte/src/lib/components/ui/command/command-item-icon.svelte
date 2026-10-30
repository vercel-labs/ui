<script lang="ts">
  import { CommandItemIcon } from "@ui-sdk/svelte/command"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof CommandItemIcon> & { class?: string } = $props()
</script>

<CommandItemIcon
  class={cn(
    "flex text-muted-foreground group-data-highlighted:text-current [&_svg]:size-4",
    className,
  )}
  {...rest}
/>
