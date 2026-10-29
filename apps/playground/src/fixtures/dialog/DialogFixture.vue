<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  createConfirm,
  createDialogController,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/vue"
import {
  alertDialogFixture,
  alertDialogOptions,
  dialogContentOptions,
  dialogFixture,
  dialogOptions,
  dialogParts,
} from "tests/fixtures/dialog.ts"
import { onMounted, ref } from "vue"
import { exposeDialogFixture, recordOpenChange } from "./shared"

const controller = createDialogController()
const confirm = createConfirm()
// The specs' hooks live on the window, which the server doesn't have.
onMounted(() => exposeDialogFixture(controller, confirm))

const options = dialogOptions()
const alertOptions = alertDialogOptions()
const content = dialogContentOptions()
const parts = dialogParts()
const action = ref("")
const triggerShown = ref(true)

function onOpenChange(open: boolean, details: { reason: string; returnValue?: string }) {
  recordOpenChange("dialog", open, details)
  if (!open && details.returnValue) action.value = details.returnValue
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Dialog v-bind="options" :controller="controller" @open-change="onOpenChange">
      <DialogTrigger v-if="triggerShown">{{ dialogFixture.trigger }}</DialogTrigger>
      <DialogBackdrop v-if="parts.backdrop" class="dialog-backdrop" />
      <DialogContent class="dialog" v-bind="content">
        <DialogTitle v-if="parts.title" class="title">{{ dialogFixture.title }}</DialogTitle>
        <DialogDescription class="description">{{ dialogFixture.description }}</DialogDescription>
        <label class="field">
          {{ dialogFixture.field }}
          <input :value="dialogFixture.defaultValue" />
        </label>
        <p v-if="parts.long" class="long">{{ dialogFixture.long }}</p>
        <div class="actions">
          <button @click="action = 'save'">{{ dialogFixture.action }}</button>
          <DialogClose>{{ dialogFixture.close }}</DialogClose>
          <button v-if="parts.removable" @click="triggerShown = false">{{ dialogFixture.remove }}</button>
        </div>
        <form v-if="parts.form" method="dialog">
          <button :value="dialogFixture.form.value">{{ dialogFixture.form.label }}</button>
        </form>
        <Dialog
          v-if="parts.nested"
          @open-change="
            (open: boolean, details: { reason: string }) => recordOpenChange('nested', open, details)
          "
        >
          <DialogTrigger>{{ dialogFixture.nested.trigger }}</DialogTrigger>
          <DialogBackdrop v-if="parts.backdrop" class="dialog-backdrop" />
          <DialogContent class="dialog">
            <DialogTitle class="title">{{ dialogFixture.nested.title }}</DialogTitle>
            <DialogClose>{{ dialogFixture.nested.close }}</DialogClose>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
    <AlertDialog v-bind="alertOptions" :controller="confirm.controller">
      <AlertDialogTrigger>{{ alertDialogFixture.trigger }}</AlertDialogTrigger>
      <AlertDialogBackdrop v-if="parts.backdrop" class="dialog-backdrop" />
      <AlertDialogContent class="dialog">
        <AlertDialogTitle class="title">{{ alertDialogFixture.title }}</AlertDialogTitle>
        <AlertDialogDescription class="description">{{
          alertDialogFixture.description
        }}</AlertDialogDescription>
        <div class="actions">
          <AlertDialogClose>{{ alertDialogFixture.cancel }}</AlertDialogClose>
          <AlertDialogClose value="confirm" @click="action = 'delete'">{{
            alertDialogFixture.action
          }}</AlertDialogClose>
        </div>
      </AlertDialogContent>
    </AlertDialog>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <button @click="controller.open()">Open with controller</button>
    <DialogTrigger v-if="parts.shortcut" :controller="controller" :shortcut="dialogFixture.shortcut.keys">
      {{ dialogFixture.shortcut.trigger }}
      <DialogShortcut />
    </DialogTrigger>
  </div>
</template>
