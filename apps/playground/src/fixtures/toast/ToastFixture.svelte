<script lang="ts">
  import { confirm } from "@ui-sdk/svelte/alert-dialog"
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
  } from "@ui-sdk/svelte/dialog"
  import { OverlayHost } from "@ui-sdk/svelte/overlays"
  import {
    Toast,
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastRegion,
    ToastTitle,
    type ToastContent,
    type ToastData,
  } from "@ui-sdk/svelte/toast"
  import { toastFixture, toastOptions, usesHost } from "tests/fixtures/toast.ts"
  import { createFixtureToasts } from "./shared"

  let action = $state("")
  // The toaster puts the specs' hooks on the window, which the server doesn't
  // have. The server's region shows the shared toaster until the client takes over.
  const toasts =
    typeof window === "undefined"
      ? undefined
      : createFixtureToasts<ToastContent>((value) => (action = value))
  const host = usesHost()
  const options = toastOptions()

  async function ask() {
    const { title, confirm: confirmLabel, cancel } = toastFixture.confirm
    const yes = await confirm({ title, confirmLabel, cancelLabel: cancel })
    action = yes ? "confirmed" : "declined"
  }
</script>

{#snippet hostedToast(toast: ToastData<ToastContent>)}
  <Toast class="toast">
    <ToastTitle />
    <ToastDescription />
    <ToastAction />
    {#if toast.cancel}
      <ToastClose action={toast.cancel.onCancel}
        >{toast.cancel.label}</ToastClose
      >
    {/if}
  </Toast>
{/snippet}

<div class="fixture">
  <button>Before</button>
  <button onclick={() => toasts?.basic()}>{toastFixture.basic.trigger}</button>
  <button onclick={() => toasts?.success()}
    >{toastFixture.success.trigger}</button
  >
  <button onclick={() => toasts?.error()}>{toastFixture.error.trigger}</button>
  <button onclick={() => toasts?.promise()}
    >{toastFixture.promise.trigger}</button
  >
  <Dialog>
    <DialogTrigger>{toastFixture.dialog.trigger}</DialogTrigger>
    <DialogContent class="dialog">
      <DialogTitle class="title">{toastFixture.dialog.title}</DialogTitle>
      <button onclick={() => toasts?.basic()}
        >{toastFixture.dialog.toast}</button
      >
      <DialogClose>{toastFixture.dialog.close}</DialogClose>
    </DialogContent>
  </Dialog>
  {#if host}<button onclick={ask}>{toastFixture.confirm.trigger}</button>{/if}
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  {#if host}
    <OverlayHost
      toast={{ ...options, class: "toast-region", children: hostedToast }}
    />
  {:else}
    <ToastRegion toaster={toasts?.toast} class="toast-region" {...options}>
      <Toast class="toast">
        <ToastTitle class="toast-title" />
        <ToastDescription class="toast-description" />
        <ToastAction class="toast-action" />
        <ToastClose class="toast-close">{toastFixture.dismiss}</ToastClose>
      </Toast>
    </ToastRegion>
  {/if}
</div>
