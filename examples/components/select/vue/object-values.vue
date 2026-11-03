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
import { ref } from "vue"
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"

type Member = { id: number; name: string; email: string }

const members: Member[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
  { id: 2, name: "Grace Hopper", email: "grace@example.com" },
  { id: 3, name: "Alan Turing", email: "alan@example.com" },
  { id: 4, name: "Margaret Hamilton", email: "margaret@example.com" },
]

const assignee = ref<Member | null>({ ...members[1] })
</script>

<template>
  <div data-slot="stack">
    <Select
      v-model:value="assignee"
      name="assignee"
      :item-to-value="(member: Member) => String(member.id)"
      :item-to-label="(member: Member) => member.name"
      :is-item-equal-to-value="(item: Member, value: Member) => item.id === value.id"
      placeholder="Unassigned"
    >
      <div data-slot="stack">
        <SelectLabel>Assignee</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
      </div>
      <SelectContent>
        <SelectItem v-for="member in members" :key="member.id" :value="member">
          <span>{{ member.name }}</span>
          <span data-slot="hint">{{ member.email }}</span>
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      </SelectContent>
    </Select>
    <output data-slot="output">Submits assignee={{ assignee ? assignee.id : "" }}</output>
  </div>
</template>
