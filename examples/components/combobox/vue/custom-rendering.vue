<script setup lang="ts">
import { CheckIcon, SearchIcon } from "@lucide/vue"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
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
      <ComboboxLabel>Mention</ComboboxLabel>
      <ComboboxInput placeholder="@username">
        <template #render="{ props }">
          <div data-slot="row">
            <SearchIcon />
            <input v-bind="props" />
          </div>
        </template>
      </ComboboxInput>
    </div>
    <ComboboxContent>
      <ComboboxEmpty>No one by that name.</ComboboxEmpty>
      <ComboboxList>
        <ComboboxItem
          v-for="user in users"
          :key="user.id"
          :value="user.username"
          :label="user.name"
          :keywords="[user.username]"
        >
          <template #render="{ props, state }">
            <div v-bind="props">
              <span data-slot="badge">
                {{ user.name.slice(0, 1) }}
              </span>
              <span data-slot="stack">
                {{ user.name }}
                <span data-slot="hint">@{{ user.username }}</span>
              </span>
              <CheckIcon v-if="state.selected" />
            </div>
          </template>
        </ComboboxItem>
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
</template>
