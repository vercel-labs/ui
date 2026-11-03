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

  let chat: HTMLButtonElement | undefined = $state()
  let messages = $state(0)

  function onOpenChange(open: boolean) {
    if (open) requestAnimationFrame(() => chat?.showPopover())
    else chat?.hidePopover()
  }
</script>

<Dialog persistentElements={() => (chat ? [chat] : [])} {onOpenChange}>
  <DialogTrigger>
    Upgrade plan
  </DialogTrigger>
  <DialogBackdrop />
  <DialogContent>
    <div data-slot="stack">
      <DialogTitle>Upgrade to Pro</DialogTitle>
      <DialogDescription>Questions? The chat in the corner still works.</DialogDescription>
    </div>
    <div data-slot="row">
      <DialogClose>
        Not now
      </DialogClose>
      <DialogClose data-variant="solid" value="upgrade">
        Upgrade
      </DialogClose>
    </div>
  </DialogContent>
</Dialog>
<button data-variant="solid" bind:this={chat} type="button" popover="manual" onclick={() => messages++}>
  Chat with us{messages ? ` (${messages})` : ""}
</button>
