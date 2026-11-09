<script setup lang="ts">
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@ui-sdk/vue"
import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A long combobox for the counts specs. Every other option
// reads `highlighted` in its render slot, so specs can tell plain options'
// renders from watched ones.
const items = perfItems(perfSize())
const count = (kind: "watched" | "plain") => (countRender(kind), "")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Combobox>
      <ComboboxInput aria-label="Search" class="input" />
      <ComboboxContent class="popup list-popup">
        <ComboboxList>
          <template v-for="(item, index) in items" :key="item.value">
            <ComboboxItem
              v-if="index % 2"
              class="item"
              :value="item.value"
              :label="item.label"
            >
              <template #render="{ props, state }">
                <div v-bind="props">
                  {{ count("watched") }}{{ state.highlighted ? "→ " : ""
                  }}{{ item.label }}
                </div>
              </template>
            </ComboboxItem>
            <ComboboxItem
              v-else
              class="item"
              :value="item.value"
              :label="item.label"
            >
              <template #render="{ props }">
                <div v-bind="props">{{ count("plain") }}{{ item.label }}</div>
              </template>
            </ComboboxItem>
          </template>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    <button>After</button>
  </div>
</template>
