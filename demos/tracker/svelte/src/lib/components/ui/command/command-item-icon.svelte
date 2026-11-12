<script lang="ts">
  import { CommandItemIcon } from "@ui-sdk/svelte/command"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof CommandItemIcon> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<CommandItemIcon
  class={cn(
    "flex text-muted-foreground group-data-highlighted:text-current [&_svg]:size-4",
    className
  )}
  {...rest}
/>
