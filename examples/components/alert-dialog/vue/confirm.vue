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
import { ref, useTemplateRef } from "vue"

const confirm = createConfirm<{ name: string }>()
const ProjectAlertDialogContent = AlertDialogContent<{ name: string }>
const projects = ref(["Acme", "Globex", "Initech"])
const reset = useTemplateRef<HTMLButtonElement>("reset")

async function remove(name: string, button: HTMLButtonElement) {
  if (!(await confirm({ name }))) return
  const row = button.closest("li")
  const next = (row?.nextElementSibling ?? row?.previousElementSibling)?.querySelector("button")
  const target = next ?? reset.value
  target?.focus()
  projects.value = projects.value.filter((project) => project !== name)
}
</script>

<template>
  <div data-slot="stack">
    <ul aria-label="Projects">
      <li data-slot="row" v-for="name in projects" :key="name">
        {{ name }}
        <button type="button" @click="remove(name, $event.currentTarget as HTMLButtonElement)">Delete</button>
      </li>
      <li data-slot="row" v-if="projects.length === 0">All projects deleted.</li>
    </ul>
    <button ref="reset" type="button" @click="projects = ['Acme', 'Globex', 'Initech']">
      Reset projects
    </button>
    <AlertDialog :controller="confirm.controller">
      <AlertDialogBackdrop />
      <ProjectAlertDialogContent v-slot="{ state }">
        <div data-slot="stack">
          <AlertDialogTitle>Delete {{ state.payload?.name }}?</AlertDialogTitle>
          <AlertDialogDescription
            >The project and its files will be deleted for everyone.</AlertDialogDescription
          >
        </div>
        <div data-slot="row">
          <AlertDialogClose>Cancel</AlertDialogClose>
          <AlertDialogClose data-variant="solid" value="confirm">Delete</AlertDialogClose>
        </div>
      </ProjectAlertDialogContent>
    </AlertDialog>
  </div>
</template>
