<script lang="ts">
  import { CommandGroupLabel } from "@ui-sdk/svelte/command"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof CommandGroupLabel> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<CommandGroupLabel
  class={cn(
    "px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground",
    className
  )}
  {...rest}
/>
