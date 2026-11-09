<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  type ConfirmOptions,
  createConfirm,
} from "@ui-sdk/vue/alert-dialog"
import { buttonVariants } from "../button"

const props = defineProps<{
  confirm: ReturnType<typeof createConfirm<ConfirmOptions>>
}>()

const ConfirmContent = AlertDialogContent<ConfirmOptions>
</script>

<template>
  <AlertDialog :controller="props.confirm.controller">
    <ConfirmContent
      v-slot="{ state }"
      class="fixed top-1/2 left-1/2 grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-4 rounded-[min(var(--radius-4xl),24px)] bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 backdrop:bg-black/30 supports-backdrop-filter:backdrop:backdrop-blur-sm data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 sm:max-w-sm motion-reduce:transition-none dark:ring-foreground/10"
    >
      <AlertDialogTitle class="text-base font-medium">{{
        state.payload?.title
      }}</AlertDialogTitle>
      <AlertDialogDescription class="text-muted-foreground">{{
        state.payload?.description
      }}</AlertDialogDescription>
      <div class="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <AlertDialogClose :class="buttonVariants()">{{
          state.payload?.cancelLabel ?? "Cancel"
        }}</AlertDialogClose>
        <AlertDialogClose
          value="confirm"
          :class="buttonVariants({ variant: 'destructive' })"
        >
          {{ state.payload?.confirmLabel ?? "Continue" }}
        </AlertDialogClose>
      </div>
    </ConfirmContent>
  </AlertDialog>
</template>
