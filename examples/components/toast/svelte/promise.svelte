<script lang="ts">
  import { onDestroy } from "svelte"
  import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/svelte/toast"

  const toast = createToaster()

  let requests = 0

function save() {
  const succeeds = ++requests % 2 === 1
    return new Promise<{ name: string }>((resolve, reject) =>
      setTimeout(
        () => (succeeds ? resolve({ name: "report.pdf" }) : reject(new Error("Network error"))),
        1500,
      ),
    )
  }

  function start() {
    toast.promise(save, {
      loading: "Saving…",
      success: (file) => ({ title: "Saved", description: file.name }),
      error: (error) => ({ title: "Could not save", description: (error as Error).message }),
    })
  }
  onDestroy(() => { toast.dismiss() })
</script>

<button data-variant="secondary" onclick={start}>
  Save
</button>
<ToastRegion toaster={toast}>
  {#snippet children(item)}
    <Toast>
      <div data-slot="stack">
        <ToastTitle />
        <ToastDescription />
      </div>
    </Toast>
  {/snippet}
</ToastRegion>
