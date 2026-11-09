<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import {
  createPopoverController,
  Dialog,
  DialogContent,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerTrigger,
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui-sdk/vue"
import {
  contentFor,
  describeChange,
  payloadOf,
  popupPayloadsFixture as fixture,
} from "tests/fixtures/popup-payloads.ts"
import { ref } from "vue"

const people = createPopoverController<string>()
const lastOpen = ref("")
const lastPayload = ref("")

function opened(name: string, open: boolean, { event }: ChangeDetails) {
  if (open) {
    lastOpen.value = describeChange(name, "open", event)
  }
}

function payloadChanged(
  name: string,
  payload: unknown,
  { event }: ChangeDetails
) {
  lastPayload.value = describeChange(name, `payload ${payload}`, event)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Menu
      @open-change="(open, details) => opened('menu', open, details)"
      @payload-change="
        (payload, details) => payloadChanged('menu', payload, details)
      "
    >
      <MenuTrigger
        v-for="label in fixture.menu.triggers"
        :key="label"
        :payload="payloadOf(label)"
      >
        {{ label }}
      </MenuTrigger>
      <MenuContent v-slot="{ state }" class="popup">
        <MenuGroup>
          <MenuGroupLabel>{{ contentFor(state.payload) }}</MenuGroupLabel>
          <MenuItem class="item" value="open">{{ fixture.menu.item }}</MenuItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
    <Popover
      :controller="people"
      @open-change="(open, details) => opened('popover', open, details)"
      @payload-change="
        (payload, details) => payloadChanged('popover', payload, details)
      "
    >
      <PopoverTrigger
        v-for="label in fixture.popover.triggers"
        :key="label"
        :payload="payloadOf(label)"
      >
        {{ label }}
      </PopoverTrigger>
      <PopoverContent v-slot="{ state }" class="popup">
        {{ contentFor(state.payload) }}
        <button @click="people.open({ payload: fixture.popover.show.payload })">
          {{ fixture.popover.show.label }}
        </button>
      </PopoverContent>
    </Popover>
    <Dialog
      :modal="false"
      @open-change="(open, details) => opened('dialog', open, details)"
      @payload-change="
        (payload, details) => payloadChanged('dialog', payload, details)
      "
    >
      <DialogTrigger
        v-for="label in fixture.dialog.triggers"
        :key="label"
        :payload="payloadOf(label)"
      >
        {{ label }}
      </DialogTrigger>
      <DialogContent v-slot="{ state }" class="dialog">{{
        contentFor(state.payload)
      }}</DialogContent>
    </Dialog>
    <Drawer
      :modal="false"
      @open-change="(open, details) => opened('drawer', open, details)"
      @payload-change="
        (payload, details) => payloadChanged('drawer', payload, details)
      "
    >
      <DrawerTrigger
        v-for="label in fixture.drawer.triggers"
        :key="label"
        :payload="payloadOf(label)"
      >
        {{ label }}
      </DrawerTrigger>
      <DrawerContent v-slot="{ state }" class="drawer">{{
        contentFor(state.payload)
      }}</DrawerContent>
    </Drawer>
    <output role="status" aria-label="Last open">{{ lastOpen }}</output>
    <output role="status" aria-label="Last payload">{{ lastPayload }}</output>
  </div>
</template>
