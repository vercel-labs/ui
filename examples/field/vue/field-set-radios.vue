<script setup lang="ts">
import { FieldLegend, FieldSet } from "@ui-sdk/vue/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"

const plans = [
  { value: "monthly", label: "Monthly", price: "$12 a month" },
  { value: "yearly", label: "Yearly", price: "$120 a year" },
]
</script>

<template>
  <FieldSet>
    <FieldLegend>
      <template #render="{ props }">
        <div v-bind="props">Billing period</div>
      </template>
    </FieldLegend>
    <RadioGroup name="period" default-value="monthly">
      <label data-slot="card" v-for="plan in plans" :key="plan.value">
        <span data-slot="row">
          <Radio :value="plan.value">
            <RadioIndicator />
          </Radio>
          {{ plan.label }}
        </span>
        <span data-slot="hint">{{ plan.price }}</span>
      </label>
    </RadioGroup>
  </FieldSet>
</template>
