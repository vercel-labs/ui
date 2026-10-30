<script setup lang="ts">
import type { Subtask } from "tracker-data"
import SubtaskItems from "~/components/subtask-items.vue"
import { TreeItem } from "~/components/ui/tree"

defineProps<{ subtasks: Subtask[] }>()
</script>

<template>
  <template v-for="subtask in subtasks" :key="subtask.id">
    <TreeItem v-if="subtask.subtasks" :value="subtask.id" :label="subtask.title">
      <SubtaskItems :subtasks="subtask.subtasks" />
    </TreeItem>
    <TreeItem v-else :value="subtask.id" :label="subtask.title" />
  </template>
</template>
