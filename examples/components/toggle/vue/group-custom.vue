<script setup lang="ts">
import { Toggle, ToggleGroup } from "@ui-sdk/vue/toggle"
import { ref } from "vue"

const weights = [
  { value: "light", label: "Light" },
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "bold", label: "Bold" },
]

const weight = ref("normal")

function select(value: string[]) {
  weight.value = value[0] ?? "normal"
}
</script>

<template>
  <div data-slot="stack">
    <ToggleGroup
      :default-value="['normal']"
      :deselectable="false"
      aria-label="Font weight"
      @value-change="select"
    >
      <Toggle v-for="item in weights" :key="item.value" :value="item.value" :data-variant="item.value">
        {{ item.label }}
      </Toggle>
    </ToggleGroup>
    <p :data-variant="weight">The quick brown fox jumps over the lazy dog.</p>
  </div>
</template>
