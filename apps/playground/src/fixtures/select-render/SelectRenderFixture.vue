<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/vue"
import { selectFixture as f } from "tests/fixtures/select.ts"
</script>

<!-- Parts rendered as other elements, with render slots and class names of state. -->
<template>
  <div class="fixture">
    <button>Before</button>
    <Select :name="f.name" :placeholder="f.placeholder">
      <SelectLabel class="label">{{ f.label }}</SelectLabel>
      <SelectTrigger>
        <template #render="{ props, state }">
          <button
            v-bind="props"
            :class="['trigger', state.open ? 'is-open' : 'is-closed']"
          >
            <SelectValue />
            <span aria-hidden="true">{{ state.open ? "▲" : "▼" }}</span>
          </button>
        </template>
      </SelectTrigger>
      <SelectContent class="popup list-popup">
        <SelectItem class="item" value="docs" href="#docs">
          <template #render="{ props }">
            <a v-bind="props">Docs</a>
          </template>
        </SelectItem>
        <SelectItem
          v-for="item in f.items.slice(0, 3)"
          :key="item.value"
          class="item"
          :value="item.value"
        >
          {{ item.label }}
        </SelectItem>
      </SelectContent>
    </Select>
    <button>After</button>
  </div>
</template>
