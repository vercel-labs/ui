<script lang="ts">
  import { ToolbarSeparator } from "@ui-sdk/svelte/toolbar"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof ToolbarSeparator> & { class?: string } = $props()
</script>

<ToolbarSeparator class={cn("mx-1 h-5 w-px shrink-0 bg-border", className)} {...rest} />
