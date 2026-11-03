<script setup lang="ts">
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"

const options = [
  { value: "default", label: "Default", description: "Standard spacing for most use cases." },
  { value: "comfortable", label: "Comfortable", description: "More space between elements." },
  { value: "compact", label: "Compact", description: "Minimal spacing for dense layouts." },
]
import { useId } from "vue"

const id = useId()
</script>

<template>
  <RadioGroup default-value="comfortable" aria-label="Density">
    <div data-slot="row" v-for="option in options" :key="option.value">
      <Radio
        :id="`${id}-density-${option.value}`"
        :value="option.value"
        :aria-describedby="`${id}-density-${option.value}-description`"
      >
        <RadioIndicator />
      </Radio>
      <div data-slot="stack">
        <label data-slot="label" :for="`${id}-density-${option.value}`">{{ option.label }}</label>
        <p data-slot="hint" :id="`${id}-density-${option.value}-description`">
          {{ option.description }}
        </p>
      </div>
    </div>
  </RadioGroup>
</template>
