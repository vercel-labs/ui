<script setup lang="ts">
import { Check } from "@lucide/vue"
import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/vue/checkbox"

const days = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
]
</script>

<template>
  <div data-slot="stack">
    <h3 id="horizontal-days">Repeat on</h3>
    <CheckboxGroup aria-labelledby="horizontal-days" :default-value="['mon', 'wed', 'fri']">
      <label data-slot="label" v-for="day in days" :key="day.value">
        <Checkbox :value="day.value">
          <CheckboxIndicator>
            <Check />
          </CheckboxIndicator>
        </Checkbox>
        {{ day.label }}
      </label>
    </CheckboxGroup>
  </div>
</template>
