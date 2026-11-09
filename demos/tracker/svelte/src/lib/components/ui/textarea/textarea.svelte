<script lang="ts">
  import { Textarea } from "@ui-sdk/svelte/textarea"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"
  import { control } from "../field/styles"

  let {
    class: className,
    ...rest
  }: ComponentProps<typeof Textarea> & { class?: string } = $props()
</script>

<Textarea
  class={cn(control, "h-auto min-h-20 resize-none py-2", className)}
  {...rest}
/>
