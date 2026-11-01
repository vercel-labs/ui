<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import { createRadioGroupController } from "@ui-sdk/vue/radio"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"
import { ref } from "vue"

const plans = [
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "team", label: "Team" },
]

const planGroup = createRadioGroupController()
const value = ref<string | null>("pro")
const reason = ref("")

function onValueChange(_: string | null, details: ChangeDetails) {
  reason.value = details.reason
}
</script>

<template>
  <div data-slot="stack">
    <RadioGroup v-model:value="value" aria-label="Plan" :controller="planGroup" @value-change="onValueChange">
      <label data-slot="label" v-for="plan in plans" :key="plan.value">
        <Radio :value="plan.value">
          <RadioIndicator />
        </Radio>
        {{ plan.label }}
      </label>
    </RadioGroup>
    <button type="button" @click="planGroup.setValue('team')">Choose Team</button>
    <div data-slot="stack">
      <output data-slot="output"
        >Value: {{ value ?? "none" }}{{ reason && `, last change: ${reason}` }}</output
      >
    </div>
  </div>
</template>
