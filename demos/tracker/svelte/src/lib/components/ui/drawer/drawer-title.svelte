<script lang="ts">
  import { DrawerTitle } from "@ui-sdk/svelte/drawer"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof DrawerTitle> & { class?: string } = $props()
</script>

<DrawerTitle class={cn("text-base font-medium", className)} {...rest} />
