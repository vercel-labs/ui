<script setup lang="ts">
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@ui-sdk/vue"
import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// Many popovers on one page, like a row action in every row of a table, for
// the counts specs. Only the first one is opened.
const items = perfItems(perfSize())
</script>

<template>
  <div class="fixture" style="flex-wrap: wrap">
    <button>Before</button>
    <Popover v-for="item in items" :key="item.value">
      <PopoverTrigger>{{ item.label }}</PopoverTrigger>
      <PopoverContent class="popup" :aria-label="item.label">
        {{ item.label }} details.
        <PopoverClose>Close</PopoverClose>
      </PopoverContent>
    </Popover>
    <button>After</button>
  </div>
</template>
