<script lang="ts">
  import { onDestroy } from "svelte"
  import {
    Toast,
    ToastAction,
    ToastDescription,
    ToastRegion,
    ToastTitle,
    createToaster,
  } from "@ui-sdk/svelte/toast"

  const toast = createToaster()

  function create() {
    toast("Invoice created", {
      description: "INV-1042",
      action: { label: "View", href: "#invoice-1042" },
    })
  }
  onDestroy(() => { toast.dismiss() })
</script>

<button data-variant="secondary" onclick={create}>
  Create invoice
</button>
<ToastRegion toaster={toast}>
  {#snippet children(item)}
    <Toast>
      <div data-slot="stack">
        <ToastTitle />
        <ToastDescription />
      </div>
      <ToastAction data-variant="secondary" />
    </Toast>
  {/snippet}
</ToastRegion>
