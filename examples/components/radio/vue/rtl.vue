<script setup lang="ts">
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"

const options = [
  { value: "default", label: "افتراضي" },
  { value: "comfortable", label: "مريح" },
  { value: "compact", label: "مضغوط" },
]
</script>

<template>
  <div dir="rtl">
    <RadioGroup default-value="comfortable" aria-label="الكثافة">
      <label data-slot="label" v-for="option in options" :key="option.value">
        <Radio :value="option.value">
          <RadioIndicator />
        </Radio>
        {{ option.label }}
      </label>
    </RadioGroup>
  </div>
</template>
