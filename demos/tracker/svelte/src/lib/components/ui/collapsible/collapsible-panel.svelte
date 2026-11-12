<script lang="ts">
  import { CollapsiblePanel } from "@ui-sdk/svelte/collapsible"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof CollapsiblePanel> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<CollapsiblePanel
  class={cn(
    "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none",
    className
  )}
  {...rest}
/>
