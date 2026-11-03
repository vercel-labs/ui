<script setup lang="ts">
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
} from "@ui-sdk/vue/drawer"
</script>

<template>
  <Drawer :snap-points="[0.5, 1]">
    <DrawerTrigger shortcut="mod+j">
      <template #render="{ props, state }">
        <button v-bind="props">
          {{ state.open ? "Viewing" : "View details" }}
          <DrawerShortcut v-slot="{ state: shortcut }">{{ shortcut.text }}</DrawerShortcut>
        </button>
      </template>
    </DrawerTrigger>
    <DrawerBackdrop />
    <DrawerContent v-slot="{ state }">
      <DrawerHandle aria-label="Resize" />
      <div data-slot="stack">
        <DrawerTitle>
          <template #render="{ props }">
            <h3 v-bind="props">Details</h3>
          </template>
        </DrawerTitle>
        <DrawerDescription>
          {{
            state.dragging
              ? "Dragging."
              : state.expanded
                ? "Expanded to its largest snap point."
                : `Resting at ${state.snapPoint}, from the ${state.side}.`
          }}
          {{ state.stack }} open above it.
        </DrawerDescription>
      </div>
      <div data-slot="stack">
        <DrawerClose data-variant="solid" href="https://example.com/details">
          <template #render="{ props }">
            <a v-bind="props">Open the full page</a>
          </template>
        </DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
</template>
