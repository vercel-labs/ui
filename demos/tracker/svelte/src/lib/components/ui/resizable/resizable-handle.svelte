<script lang="ts">
  import { ResizableHandle } from "@ui-sdk/svelte/resizable"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof ResizableHandle> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<ResizableHandle
  class={cn(
    "relative flex w-px items-center justify-center bg-border outline-none after:absolute after:inset-y-0 after:-inset-x-1 focus-visible:ring-3 focus-visible:ring-ring/30 data-dragging:bg-ring data-hovering:bg-ring",
    className
  )}
  {...rest}
>
  <div class="z-10 h-6 w-1 shrink-0 rounded-lg bg-border"></div>
</ResizableHandle>
