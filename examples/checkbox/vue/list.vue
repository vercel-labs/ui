<script setup lang="ts">
import { Check } from "@lucide/vue"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"

const items = [
  { value: "hard-disks", label: "Hard disks", checked: false },
  { value: "external-disks", label: "External disks", checked: true },
  { value: "media", label: "CDs, DVDs and iPods", checked: true },
  { value: "servers", label: "Connected servers", checked: false },
]
</script>

<template>
  <fieldset data-slot="stack">
    <legend>Show these items on the desktop</legend>
    <p data-slot="hint">Select the items you want to show on the desktop.</p>
    <label data-slot="label" v-for="item in items" :key="item.value">
      <Checkbox name="desktop" :value="item.value" :default-checked="item.checked">
        <CheckboxIndicator>
          <Check aria-hidden="true" />
        </CheckboxIndicator>
      </Checkbox>
      {{ item.label }}
    </label>
  </fieldset>
</template>
