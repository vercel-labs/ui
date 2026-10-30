<script lang="ts">
  import { ComboboxLabel } from "@ui-sdk/svelte/combobox"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let { class: className, ...rest }: ComponentProps<typeof ComboboxLabel> & { class?: string } = $props()
</script>

<ComboboxLabel class={cn("text-sm leading-none font-medium", className)} {...rest} />
