<script lang="ts">
  import {
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
  } from "@ui-sdk/svelte/drawer"

  let chat: HTMLButtonElement | undefined = $state()
  let messages = $state(0)

  function onOpenChange(open: boolean) {
    if (open) requestAnimationFrame(() => chat?.showPopover())
    else chat?.hidePopover()
  }
</script>

<Drawer persistentElements={() => (chat ? [chat] : [])} {onOpenChange}>
  <DrawerTrigger>
    Upgrade plan
  </DrawerTrigger>
  <DrawerBackdrop />
  <DrawerContent>
    <div data-slot="grip" aria-hidden="true"></div>
    <div data-slot="stack">
      <DrawerTitle>Upgrade to Pro</DrawerTitle>
      <DrawerDescription>
        Questions? The chat in the corner still works.
      </DrawerDescription>
    </div>
    <div data-slot="stack">
      <DrawerClose data-variant="solid" value="upgrade">
        Upgrade
      </DrawerClose>
      <DrawerClose>
        Not now
      </DrawerClose>
    </div>
  </DrawerContent>
</Drawer>
<button data-variant="solid" bind:this={chat} type="button" popover="manual" onclick={() => messages++}>
  Chat with us{messages ? ` (${messages})` : ""}
</button>
