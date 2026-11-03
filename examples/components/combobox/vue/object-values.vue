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
import { ref } from "vue"

const users = [
  { id: 1, name: "Ada Lovelace", username: "ada", role: "Owner" },
  { id: 2, name: "Grace Hopper", username: "grace", role: "Admin" },
  { id: 3, name: "Alan Turing", username: "alan", role: "Member" },
  { id: 4, name: "Margaret Hamilton", username: "margaret", role: "Member" },
  { id: 5, name: "Edsger Dijkstra", username: "edsger", role: "Guest" },
]

const user = ref<(typeof users)[number] | null>({ ...users[2] })
</script>

<template>
  <div data-slot="stack">
    <Combobox
      v-model:value="user"
      name="reviewer"
      :item-to-value="(item: (typeof users)[number]) => String(item.id)"
      :item-to-label="(item: (typeof users)[number]) => item.name"
      :is-item-equal-to-value="
        (item: (typeof users)[number], value: (typeof users)[number]) => item.id === value.id
      "
    >
      <div data-slot="stack">
        <ComboboxLabel>Reviewer</ComboboxLabel>
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
          <ComboboxItem v-for="item in users" :key="item.id" :value="item" :label="item.name">
            {{ item.name }}
            <ComboboxItemIndicator>
              <CheckIcon aria-hidden="true" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    <output data-slot="output">Submits reviewer={{ user ? user.id : "" }}</output>
  </div>
</template>
