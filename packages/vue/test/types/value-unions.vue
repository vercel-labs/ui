<script setup lang="ts">
// A change handler typed with the app's own union types the value, as in React.
import { ref } from "vue"
import { NavigationMenu } from "../../src/navigation-menu"
import { RadioGroup } from "../../src/radio"
import { SegmentedControl } from "../../src/segmented-control"

type Plan = "hobby" | "pro"
const plan = ref<Plan | null>("hobby")
const set = (value: Plan | null) => (plan.value = value)
</script>

<template>
  <RadioGroup default-value="hobby" @value-change="set" />
  <SegmentedControl v-model="plan" @value-change="set" />
  <NavigationMenu :value="plan" @value-change="set" />
  <!-- @vue-expect-error a value outside the union -->
  <RadioGroup v-model="plan" default-value="team" />
</template>
