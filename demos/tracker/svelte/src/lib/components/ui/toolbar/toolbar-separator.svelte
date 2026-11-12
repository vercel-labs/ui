<script lang="ts">
  import { ToolbarSeparator } from "@ui-sdk/svelte/toolbar"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof ToolbarSeparator> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<ToolbarSeparator
  class={cn("mx-1 h-5 w-px shrink-0 bg-border", className)}
  {...rest}
/>
