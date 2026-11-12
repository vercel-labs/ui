<script lang="ts">
  import { TokenInputEditor } from "@ui-sdk/svelte/token-input"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof TokenInputEditor> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<TokenInputEditor
  class={cn(
    "relative min-h-20 overflow-y-auto rounded-2xl border border-transparent bg-input/50 px-2.5 py-2 text-base outline-none transition-[color,box-shadow] duration-200 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-empty:before:pointer-events-none data-empty:before:absolute data-empty:before:text-muted-foreground data-empty:before:content-[attr(aria-placeholder)] motion-reduce:transition-none md:text-sm",
    className
  )}
  {...rest}
/>
