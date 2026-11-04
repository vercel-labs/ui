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

  onDestroy(() => { toast.dismiss() })
</script>

<button
  onclick={() => toast("Press Alt+T to reach this toast", { cancel: { label: "Done" } })}
>
  Show toast
</button>
<ToastRegion toaster={toast} shortcut="alt+t" aria-label="Alerts">
  {#snippet children(item)}
    <Toast>
      <div data-slot="stack">
        <ToastTitle />
        <ToastDescription />
      </div>
      <ToastClose />
    </Toast>
  {/snippet}
</ToastRegion>
