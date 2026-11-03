<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui-sdk/vue/alert-dialog"
import { ref } from "vue"

let attempts = 0
const status = ref("")

async function deleteProject() {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  if (attempts++ === 0) throw new Error("Couldn't delete the project. Try again.")
}

function onOpenChange(open: boolean, details: { reason: string }) {
  if (open) status.value = ""
  else if (details.reason === "action") status.value = "Deleted"
}
</script>

<template>
  <div data-slot="stack">
    <AlertDialog pending-announcement="Deleting project" @open-change="onOpenChange">
      <AlertDialogTrigger>Delete project</AlertDialogTrigger>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <div data-slot="stack">
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>This permanently deletes the project and its files.</AlertDialogDescription>
        </div>
        <AlertDialogClose data-variant="solid" value="confirm" @action="deleteProject">
          <template #render="{ props, state }">
            <div data-slot="stack">
              <div data-slot="row">
                <AlertDialogClose>Cancel</AlertDialogClose>
                <button v-bind="props">
                  {{ state.pending ? "Deleting…" : state.error ? "Try again" : "Delete" }}
                </button>
              </div>
              <p data-slot="hint" role="alert">
                {{ state.error instanceof Error ? state.error.message : "" }}
              </p>
            </div>
          </template>
        </AlertDialogClose>
      </AlertDialogContent>
    </AlertDialog>
    <output data-slot="output" aria-live="polite">{{ status }}</output>
  </div>
</template>
