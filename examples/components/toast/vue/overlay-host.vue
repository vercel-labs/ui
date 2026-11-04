<script setup lang="ts">
import { onUnmounted } from "vue"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  createConfirm,
  type ConfirmOptions,
} from "@ui-sdk/vue/alert-dialog"
import { OverlayHost, createOverlays } from "@ui-sdk/vue/overlays"
import { Toast, ToastDescription, ToastTitle, createToaster } from "@ui-sdk/vue/toast"
import { ref } from "vue"

const overlays = createOverlays()
const toast = createToaster({ overlays })
const confirm = createConfirm({ overlays })
const ConfirmAlertDialogContent = AlertDialogContent<ConfirmOptions>

const projects = ref(["Acme", "Globex"])

async function remove(name: string, button: HTMLElement) {
  const yes = await confirm({
    title: `Delete ${name}?`,
    description: "This permanently deletes the project and its files.",
    confirmLabel: "Delete",
    cancelLabel: "Keep it",
  })
  if (!yes) return
  const row = button.closest("li")!
  ;(row.nextElementSibling ?? row.previousElementSibling)?.querySelector("button")?.focus()
  projects.value = projects.value.filter((project) => project !== name)
  toast.success(`${name} deleted`, { priority: "assertive" })
}
onUnmounted(() => {
  toast.dismiss()
})
</script>

<template>
  <ul data-slot="list">
    <li data-slot="row" v-for="name in projects" :key="name">
      {{ name }}
      <button @click="remove(name, $event.currentTarget as HTMLElement)">Delete</button>
    </li>
  </ul>
  <OverlayHost :overlays="overlays">
    <template #toast>
      <Toast>
        <div data-slot="stack">
          <ToastTitle />
          <ToastDescription />
        </div>
      </Toast>
    </template>
  </OverlayHost>
  <AlertDialog :controller="confirm.controller">
    <ConfirmAlertDialogContent v-slot="{ state }">
      <AlertDialogTitle>{{ state.payload?.title }}</AlertDialogTitle>
      <AlertDialogDescription>
        {{ state.payload?.description }}
      </AlertDialogDescription>
      <div data-slot="row">
        <AlertDialogClose>
          {{ state.payload?.cancelLabel }}
        </AlertDialogClose>
        <AlertDialogClose value="confirm">
          {{ state.payload?.confirmLabel }}
        </AlertDialogClose>
      </div>
    </ConfirmAlertDialogContent>
  </AlertDialog>
</template>
