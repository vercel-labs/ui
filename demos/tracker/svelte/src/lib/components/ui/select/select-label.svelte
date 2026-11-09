<script lang="ts">
  import { SelectLabel } from "@ui-sdk/svelte/select"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof SelectLabel> & { class?: string } = $props()
</script>

<SelectLabel
  class={cn("text-sm leading-none font-medium", className)}
  {...rest}
/>
