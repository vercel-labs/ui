<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { FieldDescription, FieldLegend, FieldSet } from "@ui-sdk/vue/field"

const items = [
  { value: "comments", label: "Comments on your posts" },
  { value: "mentions", label: "Mentions" },
  { value: "follows", label: "New followers" },
]
</script>

<template>
  <FieldSet>
    <FieldLegend>Notifications</FieldLegend>
    <FieldDescription>Choose what we email you about.</FieldDescription>
    <CheckboxGroup name="notify" :default-value="['mentions']">
      <label data-slot="label" v-for="item in items" :key="item.value">
        <Checkbox :value="item.value">
          <CheckboxIndicator>
            <CheckIcon aria-hidden="true" />
          </CheckboxIndicator>
        </Checkbox>
        {{ item.label }}
      </label>
    </CheckboxGroup>
  </FieldSet>
</template>
