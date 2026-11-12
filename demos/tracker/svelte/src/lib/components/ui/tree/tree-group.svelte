<script lang="ts">
  import { TreeGroup } from "@ui-sdk/svelte/tree"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof TreeGroup> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<TreeGroup
  class={cn(
    "h-(--tree-group-height) basis-full overflow-hidden ps-6 transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none",
    className
  )}
  {...rest}
/>
