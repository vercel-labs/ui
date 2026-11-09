<script setup lang="ts">
import { Toolbar, ToolbarButton } from "@ui-sdk/vue"
import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// A toolbar with many buttons for the counts specs.
const items = perfItems(perfSize())
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Toolbar class="toolbar" aria-label="Formatting" style="flex-wrap: wrap">
      <ToolbarButton v-for="item in items" :key="item.value">{{
        item.label
      }}</ToolbarButton>
    </Toolbar>
    <button>After</button>
  </div>
</template>
