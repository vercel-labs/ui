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

  const sides = [
    { side: "top", label: "Top" },
    { side: "right", label: "Right" },
    { side: "bottom", label: "Bottom" },
    { side: "left", label: "Left" },
  ] as const
</script>

<div data-slot="row">
  {#each sides as { side, label } (side)}
    <Drawer {side} preventEdgeSwipe={side === "left" || side === "right"}>
      <DrawerTrigger>
        {label}
      </DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent>
        <div data-slot="stack">
          <DrawerTitle>Drawer from the {side}</DrawerTitle>
          <DrawerDescription>
            Drag it back toward its edge, press outside it or press Escape to close it.
          </DrawerDescription>
        </div>
        <DrawerClose data-variant="solid">
          Close
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  {/each}
</div>
