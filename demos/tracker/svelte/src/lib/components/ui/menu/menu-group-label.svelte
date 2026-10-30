<script lang="ts">
  import { MenuGroupLabel } from "@ui-sdk/svelte/menu"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof MenuGroupLabel> & { class?: string } = $props()
</script>

<MenuGroupLabel class={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)} {...rest} />
