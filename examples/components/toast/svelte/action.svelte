<script lang="ts">
  import { onDestroy } from "svelte"
  import {
    Toast,
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastRegion,
    ToastTitle,
    createToaster,
  } from "@ui-sdk/svelte/toast"

  const toast = createToaster()

  let status = $state("")

  function archive() {
    toast("Message archived", {
      action: { label: "Undo", onAction: () => (status = "Restored"), dismiss: true },
      cancel: { label: "Dismiss", onCancel: () => (status = "Kept archived") },
      onDismiss: ({ reason }) => reason === "timeout" && (status = "Timed out"),
    })
  }
  onDestroy(() => { toast.dismiss() })
</script>

<button onclick={archive}>
  Archive message
</button>
<output data-slot="output">{status}</output>
<ToastRegion toaster={toast}>
  {#snippet children(item)}
    <Toast>
      <div data-slot="stack">
        <ToastTitle />
        <ToastDescription />
      </div>
      <ToastAction />
      {#if item.cancel}
        <ToastClose action={item.cancel.onCancel}>
          {item.cancel.label}
        </ToastClose>
      {/if}
    </Toast>
  {/snippet}
</ToastRegion>
