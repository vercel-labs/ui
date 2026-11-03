<script setup lang="ts">
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/vue/combobox"

const users = [
  { id: 1, name: "Ada Lovelace", username: "ada", role: "Owner" },
  { id: 2, name: "Grace Hopper", username: "grace", role: "Admin" },
  { id: 3, name: "Alan Turing", username: "alan", role: "Member" },
  { id: 4, name: "Margaret Hamilton", username: "margaret", role: "Member" },
  { id: 5, name: "Edsger Dijkstra", username: "edsger", role: "Guest" },
]
</script>

<template>
  <Combobox>
    <div data-slot="stack">
      <ComboboxLabel>Owner</ComboboxLabel>
      <div data-slot="row">
        <ComboboxInput placeholder="Search people" />
        <ComboboxTrigger aria-label="Show people">
          <ChevronDownIcon aria-hidden="true" />
        </ComboboxTrigger>
      </div>
    </div>
    <ComboboxContent>
      <ComboboxEmpty>No people found.</ComboboxEmpty>
      <ComboboxList>
        <ComboboxItem
          v-for="user in users"
          :key="user.id"
          :value="user.username"
          :label="user.name"
          :keywords="[user.username]"
        >
          <span data-slot="badge">
            {{ user.name.slice(0, 1) }}
          </span>
          <span data-slot="stack">
            <span>{{ user.name }}</span>
            <span data-slot="hint">@{{ user.username }}</span>
          </span>
          <span data-slot="hint">
            {{ user.role }}
          </span>
          <ComboboxItemIndicator>
            <CheckIcon aria-hidden="true" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
</template>
