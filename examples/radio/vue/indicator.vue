<script setup lang="ts">
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]
</script>

<template>
  <RadioGroup default-value="system" aria-label="Theme">
    <label data-slot="label" v-for="theme in themes" :key="theme.value">
      <Radio :value="theme.value">
        <RadioIndicator keep-mounted />
      </Radio>
      {{ theme.label }}
    </label>
  </RadioGroup>
</template>
