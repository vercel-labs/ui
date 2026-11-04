<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/vue/field"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
import { ref } from "vue"
import { useLog } from "../../../shared/vue/log"

const log = useLog()
const open = ref(false)

function onOpenChange(next: boolean, details: { reason: string }) {
  log(`${next ? "Opened" : "Closed"} (${details.reason})`)
}
</script>

<template>
  <div data-slot="stack">
    <div data-slot="controls">
      <label data-slot="label">
        <Checkbox :checked="open" @checked-change="(next) => (open = next === true)">
          <CheckboxIndicator>
            <CheckIcon aria-hidden="true" />
          </CheckboxIndicator>
        </Checkbox>
        Open
      </label>
    </div>
    <Popover v-model:open="open" @open-change="onOpenChange">
      <PopoverTrigger>Set Status</PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Set a status</PopoverTitle>
        <PopoverDescription>Your team sees it next to your name.</PopoverDescription>
        <Field>
          <FieldLabel>Status</FieldLabel>
          <FieldControl default-value="In a meeting" />
        </Field>
        <div data-slot="row">
          <PopoverClose>Cancel</PopoverClose>
          <PopoverClose data-variant="solid">Save</PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
