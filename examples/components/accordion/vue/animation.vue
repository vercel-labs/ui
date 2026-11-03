<script setup lang="ts">
import { ChevronDownIcon } from "@lucide/vue"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/vue/accordion"
import { ref } from "vue"

const items = [
  {
    value: "one",
    label: "Why animate the height?",
    content: "So the content below slides instead of jumping.",
  },
  {
    value: "two",
    label: "Where does the height come from?",
    content: "The panel measures itself and writes the result to a CSS variable while it animates.",
  },
  {
    value: "three",
    label: "Does it animate on first paint?",
    content: "No. Panels open on the server or on mount show at once.",
  },
]

const status = ref("")
</script>

<template>
  <div>
    <Accordion :default-value="['one']">
      <AccordionItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        @open-change-complete="
          (open: boolean) => (status = `${open ? 'Finished opening' : 'Finished closing'} “${item.label}”`)
        "
      >
        <AccordionHeader>
          <AccordionTrigger>
            {{ item.label }}
            <ChevronDownIcon aria-hidden="true" />
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          {{ item.content }}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    <output data-slot="output">{{ status || "Open or close an item." }}</output>
  </div>
</template>
