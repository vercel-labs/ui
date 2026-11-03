<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  createConfirm,
} from "@ui-sdk/vue/alert-dialog"
import { ref } from "vue"

const confirm = createConfirm<{ name: string }>()
const ProjectAlertDialogContent = AlertDialogContent<{ name: string }>
const result = ref("")

async function review() {
  result.value = ""
  const acme = confirm({ name: "Acme" })
  const globex = confirm({ name: "Globex" })
  const [first, second] = await Promise.all([acme, globex])
  result.value = `Acme: ${first ? "confirmed" : "canceled"}. Globex: ${second ? "confirmed" : "canceled"}.`
}
</script>

<template>
  <div data-slot="stack">
    <button type="button" @click="review">Review two projects</button>
    <output data-slot="output" aria-live="polite">{{ result }}</output>
    <AlertDialog :controller="confirm.controller">
      <AlertDialogBackdrop />
      <ProjectAlertDialogContent v-slot="{ state }">
        <div data-slot="stack">
          <AlertDialogTitle>Archive {{ state.payload?.name }}?</AlertDialogTitle>
          <AlertDialogDescription
            >Archived projects leave the active list. You can restore them later.</AlertDialogDescription
          >
        </div>
        <div data-slot="row">
          <AlertDialogClose>Cancel</AlertDialogClose>
          <AlertDialogClose data-variant="solid" value="confirm">Archive</AlertDialogClose>
        </div>
      </ProjectAlertDialogContent>
    </AlertDialog>
  </div>
</template>
