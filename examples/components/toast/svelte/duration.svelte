<script lang="ts">
  import { onDestroy } from "svelte"
  import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastRegion,
    ToastTitle,
    createToaster,
  } from "@ui-sdk/svelte/toast"

  const toast = createToaster({ duration: 3000 })

  function untilDismissed() {
    toast("Your session expires soon", {
      duration: Infinity,
      dismissible: false,
      cancel: { label: "Got it" },
    })
  }
  onDestroy(() => { toast.dismiss() })
</script>

<div data-slot="row">
  <button onclick={() => toast("Copied", { duration: 1000 })}>
    1 second
  </button>
  <button onclick={() => toast("Saved")}>
    3 seconds
  </button>
  <button onclick={untilDismissed}>
    Until dismissed
  </button>
</div>
<ToastRegion toaster={toast}>
  {#snippet children(item)}
    <Toast>
      <div data-slot="stack">
        <ToastTitle />
        <ToastDescription />
      </div>
      {#if item.cancel}
        <ToastClose action={item.cancel.onCancel}>
          {item.cancel.label}
        </ToastClose>
      {/if}
    </Toast>
  {/snippet}
</ToastRegion>
