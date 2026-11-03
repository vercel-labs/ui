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

<div data-slot="row">
  {#each placements as item (item.label)}
    <button data-variant="secondary" onclick={() => place(item)}>
      {item.label}
    </button>
  {/each}
</div>
<ToastRegion toaster={toast} side={placement.side} align={placement.align}>
  {#snippet children(item)}
    <Toast>
      <div data-slot="stack">
        <ToastTitle />
        <ToastDescription />
      </div>
    </Toast>
  {/snippet}
</ToastRegion>
