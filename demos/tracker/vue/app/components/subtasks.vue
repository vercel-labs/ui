<script setup lang="ts">
import { type Issue, leaves, type Subtask } from "tracker-data"
import SubtaskItems from "~/components/subtask-items.vue"
import { Progress } from "~/components/ui/progress"
import { Tree, type TreeItemData } from "~/components/ui/tree"

const props = defineProps<{ issue: Issue }>()

const all = computed(() => leaves(props.issue.subtasks))
const checked = ref<string[]>([])
const items = computed(() => toItems(props.issue.subtasks))
const expanded = computed(() =>
  props.issue.subtasks
    .filter((subtask) => subtask.subtasks)
    .map((subtask) => subtask.id)
)

watch(
  all,
  (subtasks) =>
    (checked.value = subtasks
      .filter((subtask) => subtask.done)
      .map((subtask) => subtask.id)),
  {
    immediate: true,
  }
)

function toItems(subtasks: Subtask[]): TreeItemData[] {
  return subtasks.map((subtask) => ({
    value: subtask.id,
    label: subtask.title,
    children: subtask.subtasks && toItems(subtask.subtasks),
  }))
}
</script>

<template>
  <section
    v-if="all.length > 0"
    aria-labelledby="subtasks-label"
    class="grid gap-3"
  >
    <h3 id="subtasks-label" class="text-sm font-medium">Subtasks</h3>
    <Progress
      label="Done"
      :value="checked.length"
      :max="all.length"
      :format="(value: number) => `${value} of ${all.length}`"
    />
    <Tree
      v-model:checked="checked"
      aria-labelledby="subtasks-label"
      :items="items"
      checkable
      mode="none"
      check-strategy="leaf"
      :default-expanded="expanded"
      class="flex flex-col rounded-2xl border border-border p-1"
      @checked-change="(next: string[]) => setSubtasksDone(issue.id, next)"
    >
      <SubtaskItems :subtasks="issue.subtasks" />
    </Tree>
  </section>
</template>
