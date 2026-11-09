<script setup lang="ts">
import { createToaster } from "@ui-sdk/core/toast"
import {
  FileInput,
  FileInputItem,
  FileInputItemRemove,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  ToastRegion,
  ToastTitle,
  Toast,
  useShortcut,
} from "@ui-sdk/vue"
import { ref } from "vue"

// Values Vue parts must follow after mount, each changed by a button.
const first = new File(["a"], "first.png", { type: "image/png" })
const second = new File(["b"], "second.png", { type: "image/png" })
const file = ref(first)
const item = ref("products")
const label = ref("Notifications")
const armed = ref(false)
const presses = ref(0)
const toaster = createToaster()

// Options as a getter: once armed, the shortcut also runs in text fields.
useShortcut(
  "k",
  () => presses.value++,
  () => ({ allowInInput: armed.value })
)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <FileInput :default-value="[first, second]">
      <FileInputItem :file="file">
        {{ file.name }}
        <FileInputItemRemove>×</FileInputItemRemove>
      </FileInputItem>
    </FileInput>
    <button @click="file = second">Next file</button>

    <NavigationMenu aria-label="Site">
      <NavigationMenuList>
        <NavigationMenuItem :value="item">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>Every product</NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    <button @click="item = 'catalog'">Rename item</button>

    <ToastRegion :toaster="toaster" :aria-label="label">
      <template #default="{ toast }">
        <Toast :toast="toast"><ToastTitle /></Toast>
      </template>
    </ToastRegion>
    <button @click="toaster({ title: 'Saved' })">Show toast</button>
    <button @click="label = 'Alerts'">Rename region</button>

    <input aria-label="Search" />
    <button @click="armed = true">Arm shortcut</button>
    <output role="status" aria-label="Presses">{{ presses }}</output>
  </div>
</template>
