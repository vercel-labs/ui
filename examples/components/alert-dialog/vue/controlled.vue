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

const open = ref(false)
</script>

<template>
  <div data-slot="stack">
    <AlertDialog v-model:open="open">
      <AlertDialogTrigger>Review changes</AlertDialogTrigger>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <div data-slot="stack">
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription
            >Your edits will be lost if you leave without saving.</AlertDialogDescription
          >
        </div>
        <div data-slot="row">
          <AlertDialogClose>Keep editing</AlertDialogClose>
          <AlertDialogClose data-variant="solid" value="confirm">Discard</AlertDialogClose>
        </div>
      </AlertDialogContent>
    </AlertDialog>
    <output data-slot="output">Open: {{ open }}</output>
  </div>
</template>
