<script setup lang="ts">
import { Check } from "@lucide/vue"
import type { ChangeDetails } from "@ui-sdk/core"
import { createCheckboxGroupController } from "@ui-sdk/core/checkbox"
import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { ref } from "vue"

const days = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
]

const weekdays = ["mon", "tue", "wed", "thu", "fri"]

const schedule = createCheckboxGroupController()

const value = ref(["mon", "tue"])
const reason = ref("")

function onValueChange(_: string[], details: ChangeDetails) {
  reason.value = details.reason
}
</script>

<template>
  <div data-slot="stack">
    <h3 id="controlled-days">Working days</h3>
    <CheckboxGroup
      v-model:value="value"
      aria-labelledby="controlled-days"
      :controller="schedule"
      @value-change="onValueChange"
    >
      <label data-slot="label" v-for="day in days" :key="day.value">
        <Checkbox :value="day.value">
          <CheckboxIndicator>
            <Check aria-hidden="true" />
          </CheckboxIndicator>
        </Checkbox>
        {{ day.label }}
      </label>
    </CheckboxGroup>
    <div data-slot="row">
      <button type="button" @click="schedule.setValue(weekdays)">Select weekdays</button>
      <button type="button" @click="schedule.setValue([])">Clear</button>
    </div>

    <output data-slot="output"
      >Value: {{ JSON.stringify(value) }}{{ reason && `, last change: ${reason}` }}</output
    >
  </div>
</template>
