<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/vue"
import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A long select for the counts specs. Every other option reads
// `highlighted` in its render slot, so specs can tell plain options' renders
// from watched ones.
const items = perfItems(perfSize())
const count = (kind: "watched" | "plain") => (countRender(kind), "")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Select :default-value="items[0].value">
      <SelectTrigger aria-label="Pick" class="trigger">
        <SelectValue />
      </SelectTrigger>
      <SelectContent class="popup list-popup">
        <template v-for="(item, index) in items" :key="item.value">
          <SelectItem
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
          </SelectItem>
          <SelectItem
            v-else
            class="item"
            :value="item.value"
            :label="item.label"
          >
            <template #render="{ props }">
              <div v-bind="props">{{ count("plain") }}{{ item.label }}</div>
            </template>
          </SelectItem>
        </template>
      </SelectContent>
    </Select>
    <button>After</button>
  </div>
</template>
