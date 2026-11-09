<script setup lang="ts">
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@ui-sdk/vue"
import { perfItems, perfModal, perfSize } from "tests/fixtures/perf.ts"

// Many popovers on one page, like a row action in every row of a table, for
// the counts specs. Only the first one is opened. ?modal opens them modal.
const items = perfItems(perfSize())
const modal = perfModal()
</script>

<template>
  <div class="fixture" style="flex-wrap: wrap">
    <button>Before</button>
    <Popover v-for="item in items" :key="item.value" :modal="modal">
      <PopoverTrigger>{{ item.label }}</PopoverTrigger>
      <PopoverContent class="popup" :aria-label="item.label">
        {{ item.label }} details.
        <PopoverClose>Close</PopoverClose>
      </PopoverContent>
    </Popover>
    <button>After</button>
  </div>
</template>
