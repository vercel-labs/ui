<script setup lang="ts">
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/vue"
import { describeValue } from "tests/fixtures/accordion.ts"
import { ref } from "vue"

const action = ref("")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Accordion
      class="accordion"
      :default-value="['overview']"
      @value-change="(value: string[]) => (action = describeValue(value))"
    >
      <AccordionItem v-slot="{ state }" class="accordion-item" value="overview">
        <span :class="state.open ? 'is-open' : 'is-closed'" hidden></span>
        <AccordionHeader class="accordion-header">
          <template #render="{ props }">
            <h2 v-bind="props">
              <AccordionTrigger class="accordion-trigger">
                <template #render="{ props, state: trigger }">
                  <button v-bind="props">
                    Overview<span aria-hidden="true">
                      {{ trigger.open ? "−" : "+" }}</span
                    >
                    <span class="index" hidden>{{ trigger.index }}</span>
                  </button>
                </template>
              </AccordionTrigger>
            </h2>
          </template>
        </AccordionHeader>
        <AccordionPanel class="accordion-panel">
          <template #render="{ props }">
            <section v-bind="props">The overview panel.</section>
          </template>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem class="accordion-item" value="details">
        <AccordionHeader class="accordion-header">
          <AccordionTrigger class="accordion-trigger">
            <template #render="{ props }">
              <div v-bind="props">Details</div>
            </template>
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel class="accordion-panel"
          >The details panel.</AccordionPanel
        >
      </AccordionItem>
    </Accordion>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
