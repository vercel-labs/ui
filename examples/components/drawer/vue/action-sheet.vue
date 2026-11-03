<script setup lang="ts">
import {
  createDrawerController,
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@ui-sdk/vue/drawer"
import { ref } from "vue"

type PhotoAction = "share" | "duplicate" | "delete" | "cancel"

const photoActions = createDrawerController<undefined, PhotoAction>()
const result = ref("")

async function choose() {
  const { returnValue = "cancel" } = await photoActions.open()
  result.value = returnValue === "cancel" ? "Canceled" : `Chose ${returnValue}`
}
</script>

<template>
  <div data-slot="row">
    <button type="button" @click="choose">Photo options</button>
    <span data-slot="hint" role="status">{{ result }}</span>
    <Drawer :controller="photoActions">
      <DrawerBackdrop />
      <DrawerContent>
        <div data-slot="stack">
          <div data-slot="stack">
            <DrawerTitle>Beach.jpg</DrawerTitle>
            <DrawerDescription>Taken today at 9:41.</DrawerDescription>
          </div>
          <div data-slot="stack">
            <DrawerClose value="share">Share</DrawerClose>
            <DrawerClose value="duplicate">Duplicate</DrawerClose>
            <DrawerClose value="delete">Delete</DrawerClose>
          </div>
        </div>
        <DrawerClose value="cancel">Cancel</DrawerClose>
      </DrawerContent>
    </Drawer>
  </div>
</template>
