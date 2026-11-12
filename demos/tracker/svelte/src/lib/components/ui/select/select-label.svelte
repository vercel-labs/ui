<script lang="ts">
  import { SelectLabel } from "@ui-sdk/svelte/select"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof SelectLabel> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<SelectLabel
  class={cn("text-sm leading-none font-medium", className)}
  {...rest}
/>
