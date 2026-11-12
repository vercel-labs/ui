<script lang="ts">
  import { DrawerTitle } from "@ui-sdk/svelte/drawer"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof DrawerTitle> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<DrawerTitle class={cn("text-base font-medium", className)} {...rest} />
