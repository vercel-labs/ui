<script setup lang="ts">
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/vue"
import { perfSize } from "tests/fixtures/perf.ts"

// N closed collapsibles, like the folders of a long tree.
// With ?found, closed panels stay in the page for find in page.
const items = Array.from({ length: perfSize(200) }, (_, index) => index)
const found = new URLSearchParams(location.search).has("found")
</script>

<template>
  <div class="fixture" style="flex-direction: column; align-items: start">
    <button>Before</button>
    <Collapsible v-for="index in items" :key="index" class="collapsible-row">
      <CollapsibleTrigger class="collapsible-trigger"
        >Folder {{ index + 1 }}</CollapsibleTrigger
      >
      <CollapsiblePanel class="collapsible-panel" :hidden-until-found="found"
        >Files {{ index + 1 }}</CollapsiblePanel
      >
    </Collapsible>
    <button>After</button>
  </div>
</template>
