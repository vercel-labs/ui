<script lang="ts">
  import { Toolbar } from "@ui-sdk/svelte/toolbar"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof Toolbar> & { class?: string } = $props()
</script>

<Toolbar class={cn("flex items-center gap-2", className)} {...rest} />
