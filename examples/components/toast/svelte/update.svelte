<script lang="ts">
  import { onDestroy } from "svelte"
  import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/svelte/toast"

  const toast = createToaster()

  let timer: ReturnType<typeof setInterval> | undefined

  function upload() {
    clearInterval(timer)
    const id = toast.loading("Uploading… 0%", { id: "upload" })
    let progress = 0
    timer = setInterval(() => {
      progress += 25
      const done = progress >= 100
      const open = toast.update(
        id,
        done ? { title: "Upload complete", type: "success" } : { title: `Uploading… ${progress}%` },
      )
      if (done || !open) clearInterval(timer)
    }, 600)
  }
  onDestroy(() => { clearInterval(timer); toast.dismiss() })
</script>

<div data-slot="row">
  <button onclick={upload}>
    Upload
  </button>
  <button onclick={() => toast.dismiss("upload")}>
    Cancel upload
  </button>
  <button onclick={() => toast.dismiss()}>
    Dismiss all
  </button>
</div>
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
