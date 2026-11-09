<script setup lang="ts">
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/vue"
import { perfSize } from "tests/fixtures/perf.ts"

// An accordion of N items, like a long FAQ.
// Every item starts closed. With ?found, closed panels stay in the page for
// find in page.
const items = Array.from({ length: perfSize(200) }, (_, index) => index)
const found = new URLSearchParams(location.search).has("found")
</script>

<template>
  <div class="fixture" style="flex-direction: column; align-items: start">
    <button>Before</button>
    <Accordion class="accordion" :hidden-until-found="found">
      <AccordionItem
        v-for="index in items"
        :key="index"
        class="accordion-item"
        :value="`item-${index}`"
      >
        <AccordionHeader class="accordion-header">
          <AccordionTrigger class="accordion-trigger"
            >Question {{ index + 1 }}</AccordionTrigger
          >
        </AccordionHeader>
        <AccordionPanel class="accordion-panel"
          >Answer {{ index + 1 }}</AccordionPanel
        >
      </AccordionItem>
    </Accordion>
    <button>After</button>
  </div>
</template>
