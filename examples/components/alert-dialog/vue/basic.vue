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
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger>Delete project</AlertDialogTrigger>
    <AlertDialogBackdrop />
    <AlertDialogContent>
      <div data-slot="stack">
        <AlertDialogTitle>Delete this project?</AlertDialogTitle>
        <AlertDialogDescription
          >The project and its files will be deleted for everyone.</AlertDialogDescription
        >
      </div>
      <div data-slot="row">
        <AlertDialogClose>Cancel</AlertDialogClose>
        <AlertDialogClose data-variant="solid" value="confirm">Delete</AlertDialogClose>
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>
