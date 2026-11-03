<script lang="ts">
  import {
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHandle,
    DrawerShortcut,
    DrawerTitle,
    DrawerTrigger,
  } from "@ui-sdk/svelte/drawer"
</script>

<Drawer snapPoints={[0.5, 1]}>
  <DrawerTrigger shortcut="mod+j">
    {#snippet render({ props, state })}
      <button {...props}>
        {state.open ? "Viewing" : "View details"}
        <DrawerShortcut>
          {#snippet children(shortcut)}{shortcut.text}{/snippet}
        </DrawerShortcut>
      </button>
    {/snippet}
  </DrawerTrigger>
  <DrawerBackdrop />
  <DrawerContent>
    {#snippet children(state)}
      <DrawerHandle aria-label="Resize" />
      <div data-slot="stack">
        <DrawerTitle>
          {#snippet render({ props })}
            <h3 {...props}>Details</h3>
          {/snippet}
        </DrawerTitle>
        <DrawerDescription>
          {state.dragging
            ? "Dragging."
            : state.expanded
              ? "Expanded to its largest snap point."
              : `Resting at ${state.snapPoint}, from the ${state.side}.`}
          {state.stack} open above it.
        </DrawerDescription>
      </div>
      <div data-slot="stack">
        <DrawerClose data-variant="solid" href="https://example.com/details">
          {#snippet render({ props })}
            <a {...props}>
              Open the full page
            </a>
          {/snippet}
        </DrawerClose>
      </div>
    {/snippet}
  </DrawerContent>
</Drawer>
