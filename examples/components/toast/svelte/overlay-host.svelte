<script lang="ts">
  import { onDestroy } from "svelte"
  import {
    AlertDialog,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    createConfirm,
    type ConfirmOptions,
  } from "@ui-sdk/svelte/alert-dialog"
  import type { DialogContentState } from "@ui-sdk/svelte/dialog"
  import { OverlayHost, createOverlays } from "@ui-sdk/svelte/overlays"
  import { Toast, ToastDescription, ToastTitle, createToaster } from "@ui-sdk/svelte/toast"

  const overlays = createOverlays()
  const toast = createToaster({ overlays })
  const confirm = createConfirm({ overlays })

  let projects = $state(["Acme", "Globex"])

  async function remove(name: string, button: HTMLElement) {
    const yes = await confirm({
      title: `Delete ${name}?`,
      description: "This permanently deletes the project and its files.",
      confirmLabel: "Delete",
      cancelLabel: "Keep it",
    })
    if (!yes) return
    const row = button.closest("li")!
    ;(row.nextElementSibling ?? row.previousElementSibling)?.querySelector("button")?.focus()
    projects = projects.filter((project) => project !== name)
    toast.success(`${name} deleted`, { priority: "assertive" })
  }
  onDestroy(() => { toast.dismiss() })
</script>

<ul data-slot="list">
  {#each projects as name (name)}
    <li data-slot="row">
      {name}
      <button data-variant="secondary" onclick={(event) => remove(name, event.currentTarget)}>
        Delete
      </button>
    </li>
  {/each}
</ul>
{#snippet toastItem()}
  <Toast>
    <div data-slot="stack">
      <ToastTitle />
      <ToastDescription />
    </div>
  </Toast>
{/snippet}

<OverlayHost {overlays} toast={{ children: toastItem }} />
<AlertDialog controller={confirm.controller}>
  <AlertDialogContent>
    {#snippet children(state: DialogContentState<ConfirmOptions>)}
      {@const question = state.payload}
      <AlertDialogTitle>{question?.title}</AlertDialogTitle>
      <AlertDialogDescription>
        {question?.description}
      </AlertDialogDescription>
      <div data-slot="row">
        <AlertDialogClose data-variant="secondary">
          {question?.cancelLabel}
        </AlertDialogClose>
        <AlertDialogClose data-variant="secondary" value="confirm">
          {question?.confirmLabel}
        </AlertDialogClose>
      </div>
    {/snippet}
  </AlertDialogContent>
</AlertDialog>
