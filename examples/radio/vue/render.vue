<script setup lang="ts">
import { Bell, Check, Mail, Moon } from "@lucide/vue"
import { Radio, RadioGroup } from "@ui-sdk/vue/radio"

const options = [
  { value: "all", label: "Everything", description: "Every message and update.", icon: Bell },
  { value: "mentions", label: "Mentions", description: "Only when someone mentions you.", icon: Mail },
  { value: "none", label: "Nothing", description: "Turn notifications off.", icon: Moon },
]
import { useId } from "vue"

const id = useId()
</script>

<template>
  <RadioGroup aria-label="Notify me about" default-value="mentions">
    <Radio
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :aria-labelledby="`${id}-notify-${option.value}-label`"
      :aria-describedby="`${id}-notify-${option.value}-description`"
    >
      <template #render="{ props, state }">
        <button v-bind="props">
          <component :is="option.icon" />
          <span data-slot="stack">
            <span :id="`${id}-notify-${option.value}-label`">{{ option.label }}</span>
            <span data-slot="hint" :id="`${id}-notify-${option.value}-description`">{{
              option.description
            }}</span>
          </span>
          <Check v-if="state.checked" />
        </button>
      </template>
    </Radio>
  </RadioGroup>
</template>
