<script lang="ts">
  import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
    createConfirm,
  } from "@ui-sdk/svelte/alert-dialog"
  import {
    createDialogController,
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogShortcut,
    DialogTitle,
    DialogTrigger,
  } from "@ui-sdk/svelte/dialog"
  import {
    alertDialogFixture,
    alertDialogOptions,
    dialogContentOptions,
    dialogFixture,
    dialogOptions,
    dialogParts,
  } from "tests/fixtures/dialog.ts"
  import { exposeDialogFixture, recordOpenChange } from "./shared"

  const controller = createDialogController()
  const confirm = createConfirm()
  // The specs' hooks live on the window, which the server doesn't have.
  if (typeof window !== "undefined") {
    exposeDialogFixture(controller, confirm)
  }

  const options = dialogOptions()
  const alertOptions = alertDialogOptions()
  const content = dialogContentOptions()
  const parts = dialogParts()
  let action = $state("")
  let triggerShown = $state(true)

  function onOpenChange(
    open: boolean,
    details: { reason: string; returnValue?: string }
  ) {
    recordOpenChange("dialog", open, details)
    if (!open && details.returnValue) {
      action = details.returnValue
    }
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Dialog {...options} {controller} {onOpenChange}>
    {#if triggerShown}<DialogTrigger>{dialogFixture.trigger}</DialogTrigger
      >{/if}
    {#if parts.backdrop}<DialogBackdrop class="dialog-backdrop" />{/if}
    <DialogContent class="dialog" {...content}>
      {#if parts.title}<DialogTitle class="title"
          >{dialogFixture.title}</DialogTitle
        >{/if}
      <DialogDescription class="description"
        >{dialogFixture.description}</DialogDescription
      >
      <label class="field">
        {dialogFixture.field}
        <input value={dialogFixture.defaultValue} />
      </label>
      {#if parts.long}<p class="long">{dialogFixture.long}</p>{/if}
      <div class="actions">
        <button onclick={() => (action = "save")}>{dialogFixture.action}</button
        >
        <DialogClose>{dialogFixture.close}</DialogClose>
        {#if parts.removable}
          <button onclick={() => (triggerShown = false)}
            >{dialogFixture.remove}</button
          >
        {/if}
      </div>
      {#if parts.form}
        <form method="dialog">
          <button value={dialogFixture.form.value}
            >{dialogFixture.form.label}</button
          >
        </form>
      {/if}
      {#if parts.nested}
        <Dialog
          onOpenChange={(open, details) =>
            recordOpenChange("nested", open, details)}
        >
          <DialogTrigger>{dialogFixture.nested.trigger}</DialogTrigger>
          {#if parts.backdrop}<DialogBackdrop class="dialog-backdrop" />{/if}
          <DialogContent class="dialog">
            <DialogTitle class="title">{dialogFixture.nested.title}</DialogTitle
            >
            <DialogClose>{dialogFixture.nested.close}</DialogClose>
          </DialogContent>
        </Dialog>
      {/if}
    </DialogContent>
  </Dialog>
  <AlertDialog {...alertOptions} controller={confirm.controller}>
    <AlertDialogTrigger>{alertDialogFixture.trigger}</AlertDialogTrigger>
    {#if parts.backdrop}<AlertDialogBackdrop class="dialog-backdrop" />{/if}
    <AlertDialogContent class="dialog">
      <AlertDialogTitle class="title"
        >{alertDialogFixture.title}</AlertDialogTitle
      >
      <AlertDialogDescription class="description"
        >{alertDialogFixture.description}</AlertDialogDescription
      >
      <div class="actions">
        <AlertDialogClose>{alertDialogFixture.cancel}</AlertDialogClose>
        <AlertDialogClose value="confirm" onclick={() => (action = "delete")}>
          {alertDialogFixture.action}
        </AlertDialogClose>
      </div>
    </AlertDialogContent>
  </AlertDialog>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <button onclick={() => controller.open()}>Open with controller</button>
  {#if parts.shortcut}
    <DialogTrigger {controller} shortcut={dialogFixture.shortcut.keys}>
      {dialogFixture.shortcut.trigger}
      <DialogShortcut />
    </DialogTrigger>
  {/if}
</div>
