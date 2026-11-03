<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { ref } from "vue"

const toppings = [
  { value: "cheese", label: "Cheese" },
  { value: "mushrooms", label: "Mushrooms" },
  { value: "olives", label: "Olives" },
  { value: "peppers", label: "Peppers" },
]

const submitted = ref<string | null>(null)

function onSubmit(event: Event) {
  submitted.value = new FormData(event.target as HTMLFormElement).getAll("toppings").join(", ")
}
</script>

<template>
  <div data-slot="stack">
    <h3 id="form-toppings">Toppings</h3>
    <p data-slot="hint">Choose at least one.</p>
    <CheckboxGroup
      aria-labelledby="form-toppings"
      name="toppings"
      form="toppings-form"
      :default-value="['cheese']"
      required
    >
      <label data-slot="label" v-for="topping in toppings" :key="topping.value">
        <Checkbox :value="topping.value">
          <CheckboxIndicator>
            <CheckIcon aria-hidden="true" />
          </CheckboxIndicator>
        </Checkbox>
        {{ topping.label }}
      </label>
    </CheckboxGroup>
    <form data-slot="row" id="toppings-form" @submit.prevent="onSubmit" @reset="submitted = null">
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
    <output data-slot="output">{{ submitted !== null ? `toppings: ${submitted}` : "" }}</output>
  </div>
</template>
