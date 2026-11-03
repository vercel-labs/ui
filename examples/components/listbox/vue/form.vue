<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/vue/listbox"
import { ref } from "vue"

const toppings = [
  { value: "basil", label: "Basil" },
  { value: "cheese", label: "Extra cheese" },
  { value: "mushroom", label: "Mushroom" },
  { value: "olive", label: "Olive" },
  { value: "onion", label: "Onion" },
  { value: "pepper", label: "Pepper" },
]

const submitted = ref("")

function onSubmit(event: Event) {
  submitted.value = new FormData(event.target as HTMLFormElement).getAll("toppings").join(", ")
}
</script>

<template>
  <div data-slot="stack">
    <form id="pizza-order" data-slot="row" @submit.prevent="onSubmit">
      <button>Order</button>
      <button type="reset">Reset</button>
    </form>
    <Listbox
      multiple
      name="toppings"
      form="pizza-order"
      required
      :default-value="['cheese']"
      aria-label="Toppings"
    >
      <ListboxItem v-for="topping in toppings" :key="topping.value" :value="topping.value">
        {{ topping.label }}
        <ListboxItemIndicator>
          <CheckIcon aria-hidden="true" />
        </ListboxItemIndicator>
      </ListboxItem>
    </Listbox>
    <output data-slot="output">Submitted: {{ submitted || "nothing yet" }}</output>
  </div>
</template>
