<script setup lang="ts">
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/vue"
import {
  countRender,
  perfItems,
  perfOptions,
  perfSize,
} from "tests/fixtures/perf.ts"

// Rows like a table's, each with a closed menu, select and tooltip, for the
// counts specs. Every part counts its renders by kind, so specs
// can tell what mounting a row renders.
const rows = perfItems(perfSize(200)).map((row) => row.label.slice(5))
const options = perfItems(perfOptions())
const actions = ["Rename", "Duplicate", "Delete"]
const count = (
  kind: "trigger" | "menuItem" | "value" | "option" | "tooltip"
) => (countRender(kind), "")
</script>

<template>
  <div class="fixture" style="flex-direction: column; align-items: start">
    <button>Before</button>
    <div
      v-for="label in rows"
      :key="label"
      class="row"
      style="display: flex; gap: 8px"
    >
      <Menu>
        <MenuTrigger>
          <template #render="{ props }">
            <button v-bind="props">
              {{ count("trigger") }}Menu {{ label }}
            </button>
          </template>
        </MenuTrigger>
        <MenuContent class="popup">
          <MenuItem
            v-for="action in actions"
            :key="action"
            class="item"
            :value="action"
          >
            <template #render="{ props }">
              <div v-bind="props">{{ count("menuItem") }}{{ action }}</div>
            </template>
          </MenuItem>
        </MenuContent>
      </Menu>
      <Select :default-value="options[0].value">
        <SelectTrigger :aria-label="`Select ${label}`" class="trigger">
          <template #render="{ props }">
            <button v-bind="props">
              {{ count("trigger") }}
              <SelectValue>
                <template #render="{ props: valueProps, state }">
                  <span v-bind="valueProps"
                    >{{ count("value") }}{{ state.label }}</span
                  >
                </template>
              </SelectValue>
            </button>
          </template>
        </SelectTrigger>
        <SelectContent class="popup list-popup">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            class="item"
            :value="option.value"
            :label="option.label"
          >
            <template #render="{ props }">
              <div v-bind="props">{{ count("option") }}{{ option.label }}</div>
            </template>
          </SelectItem>
        </SelectContent>
      </Select>
      <Tooltip>
        <TooltipTrigger>
          <template #render="{ props }">
            <button v-bind="props">
              {{ count("trigger") }}Tip {{ label }}
            </button>
          </template>
        </TooltipTrigger>
        <TooltipContent class="tooltip">
          <template #render="{ props }">
            <div v-bind="props">{{ count("tooltip") }}Hint {{ label }}</div>
          </template>
        </TooltipContent>
      </Tooltip>
    </div>
    <button>After</button>
  </div>
</template>
