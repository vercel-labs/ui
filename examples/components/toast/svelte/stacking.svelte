<script lang="ts">
  import { onDestroy } from "svelte"
  import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/svelte/toast"

  const toast = createToaster()
  let count = 0

  let expanded = $state(false)

  function add() {
    toast(`Notification ${++count}`, { description: "Stacked with the others" })
  }
  onDestroy(() => { toast.dismiss() })
</script>

<div data-slot="row">
  <button data-variant="secondary" onclick={add}>
    Add toast
  </button>
  <label data-slot="label">
    <input bind:checked={expanded} type="checkbox" />
    Always expanded
  </label>
</div>
<ToastRegion toaster={toast} maxVisible={4} {expanded}>
  {#snippet children(item)}
    <Toast>
      <div data-slot="stack">
        <ToastTitle />
        <ToastDescription />
      </div>
    </Toast>
  {/snippet}
</ToastRegion>
