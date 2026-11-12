<script lang="ts">
  import { Textarea } from "@ui-sdk/svelte/textarea"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"
  import { control } from "../field/styles"

  interface Props extends ComponentProps<typeof Textarea> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<Textarea
  class={cn(control, "h-auto min-h-20 resize-none py-2", className)}
  {...rest}
/>
