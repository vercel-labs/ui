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

  let container: HTMLDivElement | undefined = $state()
</script>

<Drawer {container}>
  <DrawerTrigger>
    Open in the box
  </DrawerTrigger>
  <DrawerBackdrop />
  <DrawerContent>
    <div data-slot="grip" aria-hidden="true"></div>
    <div data-slot="stack">
      <DrawerTitle>Portaled</DrawerTitle>
      <DrawerDescription>
        This drawer is in the box below, in the DOM.
      </DrawerDescription>
    </div>
    <div data-slot="stack">
      <DrawerClose data-variant="solid">
        Close
      </DrawerClose>
    </div>
  </DrawerContent>
</Drawer>
<div data-slot="stack">
  Container
  <div bind:this={container}></div>
</div>
