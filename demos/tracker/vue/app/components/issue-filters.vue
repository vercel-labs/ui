<script setup lang="ts">
import { people, personOf, priorities, type Query } from "tracker-data"
import { Avatar } from "~/components/ui/avatar"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "~/components/ui/combobox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "~/components/ui/select"

defineProps<{ query: Query; stacked?: boolean }>()

const emit = defineEmits<{ change: [patch: Partial<Query>] }>()

const priorityItems = [{ value: "any", label: "Any priority" }, ...priorities]
</script>

<template>
  <div :class="stacked ? 'grid gap-4' : 'flex items-center gap-2'">
    <Select
      :items="priorityItems"
      :value="query.priority ?? 'any'"
      @value-change="
        (value: string | null) =>
          emit('change', {
            priority: value === 'any' ? null : (value as Query['priority']),
            page: 1,
          })
      "
    >
      <div class="grid gap-2">
        <SelectLabel :class="stacked ? undefined : 'sr-only'">{{
          stacked ? "Priority" : "Filter by priority"
        }}</SelectLabel>
        <SelectTrigger :class="stacked ? undefined : 'w-36'" />
      </div>
      <SelectContent>
        <SelectItem
          v-for="priority in priorityItems"
          :key="priority.value"
          :value="priority.value"
        >
          {{ priority.label }}
        </SelectItem>
      </SelectContent>
    </Select>
    <Combobox
      :value="query.assignee"
      :item-to-label="(id: string) => personOf(id)?.name ?? ''"
      @value-change="
        (value: string | null) => emit('change', { assignee: value, page: 1 })
      "
    >
      <div class="grid gap-2">
        <ComboboxLabel :class="stacked ? undefined : 'sr-only'">{{
          stacked ? "Assignee" : "Filter by assignee"
        }}</ComboboxLabel>
        <div :class="stacked ? 'relative' : 'relative w-40'">
          <ComboboxInput
            placeholder="Anyone"
            class="h-8 w-full rounded-2xl bg-input/50 px-2.5 pe-8 focus-visible:ring-3 focus-visible:ring-ring/30"
          />
          <ComboboxTrigger aria-label="Show people" />
        </div>
      </div>
      <ComboboxContent>
        <ComboboxEmpty>Nobody matches.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxItem
            v-for="person in people"
            :key="person.id"
            :value="person.id"
            :label="person.name"
          >
            <Avatar :name="person.name" size="sm" decorative />
            {{ person.name }}
          </ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  </div>
</template>
