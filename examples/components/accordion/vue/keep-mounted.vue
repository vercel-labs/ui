<script setup lang="ts">
import { ChevronDownIcon } from "@lucide/vue"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/vue/accordion"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/vue/field"
</script>

<template>
  <Accordion :default-value="['reply']">
    <AccordionItem value="reply">
      <AccordionHeader>
        <AccordionTrigger>
          Reply to this thread
          <ChevronDownIcon aria-hidden="true" />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionPanel keep-mounted>
        <Field>
          <FieldLabel>Message</FieldLabel>
          <FieldControl rows="3" placeholder="Write a reply…">
            <template #render="{ props }">
              <textarea v-bind="props" />
            </template>
          </FieldControl>
        </Field>
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem value="formatting">
      <AccordionHeader>
        <AccordionTrigger>
          Formatting
          <ChevronDownIcon aria-hidden="true" />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionPanel>
        <p>Use **bold**, _italics_ and `code`. Links paste as previews.</p>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
</template>
