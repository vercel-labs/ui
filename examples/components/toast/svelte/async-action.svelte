<script lang="ts">
  import { onDestroy } from "svelte"
  import { Toast, ToastAction, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/svelte/toast"

  const toast = createToaster({ duration: 4000 })

  const restore = () => new Promise((resolve) => setTimeout(resolve, 1500))

  onDestroy(() => { toast.dismiss() })
</script>

<button
  onclick={() => toast("File deleted", { action: { label: "Undo", onAction: restore } })}
>
  Delete file
</button>
<ToastRegion toaster={toast}>
  <Toast>
    <ToastTitle />
    <ToastAction>
      {#snippet children(state)}
        {state.pending ? "Restoring…" : state.error ? "Try again" : "Undo"}
      {/snippet}
    </ToastAction>
  </Toast>
</ToastRegion>
