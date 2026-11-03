<script setup lang="ts">
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/vue/drawer"
import { onBeforeUnmount, onMounted, ref } from "vue"

const color = ref("")
let cleanup = () => {}

onMounted(() => {
  const existing = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  const meta =
    existing ?? Object.assign(document.createElement("meta"), { name: "theme-color", content: "#ffffff" })
  if (!existing) document.head.append(meta)
  const read = () => (color.value = meta.content)
  read()
  const observer = new MutationObserver(read)
  observer.observe(meta, { attributes: true, attributeFilter: ["content"] })
  cleanup = () => {
    observer.disconnect()
    if (!existing) meta.remove()
  }
})
onBeforeUnmount(() => cleanup())
</script>

<template>
  <div data-slot="stack">
    <Drawer theme-color>
      <DrawerTrigger>Dim the toolbar</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent>
        <div data-slot="grip" aria-hidden="true" />
        <div data-slot="stack">
          <DrawerTitle>Theme color</DrawerTitle>
          <DrawerDescription
            >On an iPhone, Safari's toolbars dim with the page. The drawer writes the color where motion
            starts and ends, never on every frame.</DrawerDescription
          >
        </div>
        <div data-slot="stack">
          <DrawerClose data-variant="solid">Close</DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
    <p data-slot="row">
      <span data-slot="swatch" aria-hidden="true" :style="{ background: color }" />
      theme-color: {{ color }}
    </p>
  </div>
</template>
