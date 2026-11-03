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

  const toast = createToaster()

  function show() {
    toast("Event has been created", {
      description: "Your event is ready to share.",
      cancel: { label: "Dismiss" },
    })
  }
  onDestroy(() => { toast.dismiss() })
</script>

<button data-variant="secondary" onclick={show}>
  Show toast
</button>
<ToastRegion toaster={toast}>
  {#snippet children(item)}
    <Toast>
      <div data-slot="stack">
        <ToastTitle />
        <ToastDescription />
      </div>

      {#if item.cancel}
        <ToastClose data-variant="secondary" action={item.cancel.onCancel}>
          {item.cancel.label}
        </ToastClose>
      {/if}
    </Toast>
  {/snippet}
</ToastRegion>
