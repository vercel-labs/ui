<script lang="ts">
  import { onDestroy } from "svelte"
  import { XIcon } from "@lucide/svelte"
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

  function message() {
    toast({
      title: "Ada Lovelace",
      description: "Can you look at the draft?",
      data: { initials: "AL" },
      action: { label: "Reply", onAction: () => toast("Reply opened") },
    })
  }
  onDestroy(() => { toast.dismiss() })
</script>

<button onclick={message}>
  New message
</button>
<ToastRegion toaster={toast} aria-label="Messages">
  {#snippet children(item)}
    <Toast>
      <span data-slot="media">
        {(item.data as { initials: string }).initials}
      </span>
      <div data-slot="stack">
        <ToastTitle />
        <ToastDescription />
      </div>
      <ToastAction />
      <ToastClose aria-label="Close">
        <XIcon aria-hidden="true" />
      </ToastClose>
    </Toast>
  {/snippet}
</ToastRegion>
