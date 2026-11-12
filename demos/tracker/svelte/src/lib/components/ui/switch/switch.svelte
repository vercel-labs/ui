<script lang="ts">
  import { Switch, SwitchThumb } from "@ui-sdk/svelte/switch"
  import { cn } from "cn"
  import type { ComponentProps } from "svelte"

  interface Props extends ComponentProps<typeof Switch> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<Switch
  class={cn(
    "relative inline-flex h-5 w-8 shrink-0 cursor-default items-center rounded-2xl border-2 border-transparent bg-input/90 outline-none transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:bg-primary data-disabled:opacity-50 motion-reduce:transition-none",
    className
  )}
  {...rest}
>
  <SwitchThumb
    class="pointer-events-none block size-4 rounded-2xl bg-background shadow-sm transition-transform data-checked:translate-x-[calc(100%-4px)] rtl:data-checked:-translate-x-[calc(100%-4px)] motion-reduce:transition-none"
  />
</Switch>
