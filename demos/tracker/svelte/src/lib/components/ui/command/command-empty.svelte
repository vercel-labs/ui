<script lang="ts">
  import { CommandEmpty } from "@ui-sdk/svelte/command"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof CommandEmpty> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<CommandEmpty
  class={cn(
    "py-10 text-center text-sm text-muted-foreground empty:hidden",
    className
  )}
  {...rest}
/>
