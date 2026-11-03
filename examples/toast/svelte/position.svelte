<script lang="ts">
  import { onDestroy } from "svelte"
  import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/svelte/toast"

  const toast = createToaster()

  const placements = [
    { side: "top", align: "start", label: "Top Left" },
    { side: "top", align: "center", label: "Top Center" },
    { side: "top", align: "end", label: "Top Right" },
    { side: "bottom", align: "start", label: "Bottom Left" },
    { side: "bottom", align: "center", label: "Bottom Center" },
    { side: "bottom", align: "end", label: "Bottom Right" },
  ] as const

  let placement = $state<(typeof placements)[number]>(placements[5])

  function place(item: (typeof placements)[number]) {
    placement = item
    toast("Event has been created", { description: item.label })
  }
  onDestroy(() => { toast.dismiss() })
</script>

<div class="flex flex-wrap gap-2">
  {#each placements as item (item.label)}
    <button
      class="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50"
      onclick={() => place(item)}
    >
      {item.label}
    </button>
  {/each}
</div>
<ToastRegion
  toaster={toast}
  side={placement.side}
  align={placement.align}
  class="m-4 w-[356px] max-w-[calc(100vw-2rem)] h-(--toast-front-height) outline-none [--dir:-1] data-[side=top]:[--dir:1] data-expanded:h-[calc(var(--toast-stack-height)+(var(--toast-count)-1)*0.75rem)]"
>
  {#snippet children(item)}
    <Toast class="absolute inset-x-0 z-[calc(100-var(--toast-index))] flex h-(--toast-height) items-center gap-3 overflow-hidden rounded-2xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-[color-mix(in_oklch,var(--popover),var(--foreground)_5%)] outline-none transition-[translate,scale,opacity,height,box-shadow] duration-400 ease-[ease] before:pointer-events-none before:absolute before:inset-0 before:bg-inherit before:opacity-0 before:[transition:inherit] in-data-[side=bottom]:bottom-0 in-data-[side=top]:top-0 [--y:calc(var(--dir)*var(--toast-index)*0.75rem)] [translate:calc(var(--toast-swipe-x,0px)+var(--exit-x,0px))_calc(var(--y)+var(--toast-swipe-y,0px)+var(--exit-y,0px)*var(--slide,1))] scale-[calc(1-var(--toast-index)*0.05)] not-data-front:not-data-expanded:h-(--toast-front-height) not-data-front:not-data-expanded:before:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/30 data-expanded:scale-100 data-expanded:duration-200 data-expanded:ease-out data-expanded:[--y:calc(var(--dir)*(var(--toast-offset)+var(--toast-index)*0.75rem))] not-data-front:data-starting-style:opacity-0 data-front:data-starting-style:[--y:calc(var(--dir)*-100%)] data-ending-style:opacity-0 data-ending-style:duration-200 data-ending-style:ease-out motion-safe:data-ending-style:[--exit-y:calc(var(--dir)*-100%)] not-data-front:not-data-expanded:data-ending-style:[--exit-y:0px] motion-safe:data-[swipe-direction=left]:[--exit-x:-100%] data-[swipe-direction=left]:[--slide:0] motion-safe:data-[swipe-direction=right]:[--exit-x:100%] data-[swipe-direction=right]:[--slide:0] data-starting-style:transition-none data-swiping:transition-none motion-reduce:transition-opacity motion-reduce:data-starting-style:opacity-0 dark:ring-[color-mix(in_oklch,var(--popover),var(--foreground)_10%)]">
      <div class="grid flex-1 gap-1">
        <ToastTitle class="font-medium" />
        <ToastDescription class="text-muted-foreground" />
      </div>
    </Toast>
  {/snippet}
</ToastRegion>
