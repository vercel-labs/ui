<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/vue/select"
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"

type Member = { id: number; name: string; email: string }

const members: Member[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
  { id: 2, name: "Grace Hopper", email: "grace@example.com" },
  { id: 3, name: "Alan Turing", email: "alan@example.com" },
  { id: 4, name: "Margaret Hamilton", email: "margaret@example.com" },
]
</script>

<template>
  <Select default-value="1">
    <div data-slot="stack">
      <SelectLabel>Reviewer</SelectLabel>
      <SelectTrigger>
        <template #render="{ props }">
          <button v-bind="props">
            <SelectValue v-slot="{ state: selected }">
              <span data-slot="badge">
                {{ members.find((candidate) => String(candidate.id) === selected.value)?.name.slice(0, 1) }}
              </span>
              {{ selected.label }}
            </SelectValue>
            <ChevronDownIcon />
          </button>
        </template>
      </SelectTrigger>
    </div>
    <SelectContent>
      <SelectItem
        v-for="member in members"
        :key="member.id"
        :value="String(member.id)"
        :label="member.name"
        :disabled="member.id === 4"
      >
        <template #render="{ props, state }">
          <div v-bind="props">
            <span data-slot="badge">
              {{ member.name.slice(0, 1) }}
            </span>
            <span data-slot="stack">
              {{ member.name }}
              <span data-slot="hint">{{ state.disabled ? "Out of office" : member.email }}</span>
            </span>
            <SelectItemIndicator>
              <template #render="{ props: indicatorProps, state: indicator }">
                <span v-bind="indicatorProps"><CheckIcon v-if="indicator.selected" /></span>
              </template>
            </SelectItemIndicator>
          </div>
        </template>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
