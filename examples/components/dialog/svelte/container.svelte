<script lang="ts">
  import {
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
  } from "@ui-sdk/svelte/dialog"

  let container: HTMLDivElement | undefined = $state()
</script>

<Dialog {container}>
  <DialogTrigger>
    Open in the box
  </DialogTrigger>
  <DialogBackdrop />
  <DialogContent>
    <div data-slot="stack">
      <DialogTitle>Portaled</DialogTitle>
      <DialogDescription>This dialog is in the box below, in the DOM.</DialogDescription>
    </div>
    <div data-slot="row">
      <DialogClose data-variant="solid">
        Close
      </DialogClose>
    </div>
  </DialogContent>
</Dialog>
<div data-slot="stack">
  Container
  <div bind:this={container}></div>
</div>
