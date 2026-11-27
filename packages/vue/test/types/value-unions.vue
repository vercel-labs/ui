<script setup lang="ts">
// A change handler typed with the app's own union types the value, as in React.
import { ref } from "vue"
import { Checkbox, CheckboxGroup } from "../../src/checkbox"
import { NavigationMenu } from "../../src/navigation-menu"
import { RadioGroup } from "../../src/radio"
import { SegmentedControl } from "../../src/segmented-control"
import { Toggle, ToggleGroup } from "../../src/toggle"

type Plan = "hobby" | "pro"
const plan = ref<Plan | null>("hobby")
const set = (value: Plan | null) => (plan.value = value)
const plans = ref<Plan[]>(["hobby"])
const setAll = (value: Plan[]) => (plans.value = value)
</script>

<template>
  <RadioGroup default-value="hobby" @value-change="set" />
  <SegmentedControl v-model="plan" @value-change="set" />
  <NavigationMenu v-slot="{ state }" :value="plan" @value-change="set">
    {{ set(state.value) }}
  </NavigationMenu>
  <!-- @vue-expect-error a value outside the union -->
  <RadioGroup v-model="plan" default-value="team" />
  <CheckboxGroup v-model="plans" @value-change="setAll">
    <Checkbox value="pro" />
  </CheckboxGroup>
  <ToggleGroup v-model="plans" @value-change="setAll">
    <Toggle value="pro" />
  </ToggleGroup>
  <!-- @vue-expect-error a value outside the union -->
  <ToggleGroup v-model="plans" :default-value="['team']" />
</template>
