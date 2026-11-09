<script setup lang="ts">
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemIndicator,
  MenuTrigger,
} from "@ui-sdk/vue"
import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A long menu for the counts specs. Every other item reads `highlighted` in
// its render slot, so specs can tell plain items' renders from watched ones.
// A checkbox item at the end changes state that only it and its indicator show.
const items = perfItems(perfSize())
const count = (kind: "watched" | "plain" | "checkbox") => (
  countRender(kind),
  ""
)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Menu>
      <MenuTrigger>File</MenuTrigger>
      <MenuContent class="popup" style="max-height: 320px; overflow: auto">
        <template v-for="(item, index) in items" :key="item.value">
          <MenuItem v-if="index % 2" class="item" :value="item.value">
            <template #render="{ props, state }">
              <div v-bind="props">
                {{ count("watched") }}{{ state.highlighted ? "→ " : ""
                }}{{ item.label }}
              </div>
            </template>
          </MenuItem>
          <MenuItem v-else class="item" :value="item.value">
            <template #render="{ props }">
              <div v-bind="props">{{ count("plain") }}{{ item.label }}</div>
            </template>
          </MenuItem>
        </template>
        <MenuCheckboxItem class="item" value="wrap">
          <template #render="{ props }">
            <div v-bind="props">
              {{ count("checkbox")
              }}<MenuItemIndicator>✓</MenuItemIndicator>Wrap lines
            </div>
          </template>
        </MenuCheckboxItem>
      </MenuContent>
    </Menu>
    <button>After</button>
  </div>
</template>
