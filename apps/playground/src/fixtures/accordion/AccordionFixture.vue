<script setup lang="ts">
import { createAccordionController } from "@ui-sdk/core/accordion"
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@ui-sdk/vue"
import { accordionFixture, describeValue } from "tests/fixtures/accordion.ts"
import { accordionOptions } from "tests/fixtures/page.ts"
import { ref } from "vue"

const controller = createAccordionController()
const { cancel, ...options } = accordionOptions()

const action = ref("")
const complete = ref("")
const warrantyEnabled = ref(false)

function onValueChange(value: string[], details: { cancel: () => void }) {
  if (cancel && value.includes(cancel) && !controller.getValue().includes(cancel)) return details.cancel()
  action.value = describeValue(value)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Accordion class="accordion" v-bind="options" :controller="controller" @value-change="onValueChange">
      <AccordionItem
        v-for="item in accordionFixture.items"
        :key="item.value"
        class="accordion-item"
        :value="item.value"
        :disabled="item.disabled && !warrantyEnabled"
        @open-change-complete="(open: boolean) => (complete = `${item.value} ${open ? 'open' : 'closed'}`)"
      >
        <AccordionHeader class="accordion-header">
          <AccordionTrigger class="accordion-trigger">{{ item.label }}</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel class="accordion-panel">
          {{ item.content }}
          <label v-if="item.field"> {{ item.field }} <input /></label>
          <button v-if="item.close" @click="controller.close(item.value)">{{ item.close }}</button>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output aria-label="Last completed">{{ complete }}</output>
    <button @click="controller.open('support')">Show support</button>
    <button @click="warrantyEnabled = !warrantyEnabled">Toggle warranty</button>
  </div>
</template>
