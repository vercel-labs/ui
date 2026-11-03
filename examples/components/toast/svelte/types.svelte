<script lang="ts">
  import { onDestroy } from "svelte"
  import { CircleCheckIcon, InfoIcon, LoaderCircleIcon, OctagonXIcon, TriangleAlertIcon } from "@lucide/svelte"
  import { Toast, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/svelte/toast"

  const toast = createToaster()

  function promise() {
    toast.promise(
      new Promise<{ name: string }>((resolve) => setTimeout(() => resolve({ name: "Event" }), 2000)),
      {
        loading: "Loading...",
        success: (data) => `${data.name} has been created`,
        error: "Error",
      },
    )
  }
  onDestroy(() => { toast.dismiss() })
</script>

<div data-slot="row">
  <button data-variant="secondary" onclick={() => toast("Event has been created")}>
    Default
  </button>
  <button data-variant="secondary" onclick={() => toast.success("Event has been created")}>
    Success
  </button>
  <button data-variant="secondary"
    onclick={() => toast.info("Be at the area 10 minutes before the event time")}
  >
    Info
  </button>
  <button data-variant="secondary"
    onclick={() => toast.warning("Event start time cannot be earlier than 8am")}
  >
    Warning
  </button>
  <button data-variant="secondary" onclick={() => toast.error("Event has not been created")}>
    Error
  </button>
  <button data-variant="secondary" onclick={promise}>
    Promise
  </button>
</div>
<ToastRegion toaster={toast}>
  <Toast>
    <CircleCheckIcon data-show="success" aria-hidden="true" />
    <InfoIcon data-show="info" aria-hidden="true" />
    <TriangleAlertIcon data-show="warning" aria-hidden="true" />
    <OctagonXIcon data-show="error" aria-hidden="true" />
    <LoaderCircleIcon data-show="loading" aria-hidden="true" />
    <ToastTitle />
  </Toast>
</ToastRegion>
