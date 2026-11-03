<script setup lang="ts">
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@ui-sdk/vue/autocomplete"
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import { ref } from "vue"

const fruits = [
  "Apple",
  "Apricot",
  "Avocado",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Grape",
  "Lemon",
  "Mango",
  "Orange",
  "Peach",
  "Pear",
  "Pineapple",
  "Strawberry",
]

const submitted = ref("")

function submit(event: Event) {
  const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
    ([name, value]) => `${name}=${value}`,
  )
  submitted.value = data.join("&")
}
</script>

<template>
  <form id="order" data-slot="stack" @submit.prevent="submit">
    <Field>
      <FieldLabel>Fruit</FieldLabel>
      <Autocomplete name="fruit" form="order" required default-value="Apple">
        <AutocompleteInput />
        <AutocompleteContent>
          <AutocompleteList>
            <AutocompleteItem v-for="fruit in fruits" :key="fruit" :value="fruit">{{
              fruit
            }}</AutocompleteItem>
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
      <FieldDescription>Any fruit, listed or not.</FieldDescription>
      <div><FieldError /></div>
    </Field>
    <div data-slot="row">
      <button type="submit" data-variant="solid">Submit</button>
      <button type="reset">Reset</button>
    </div>
    <output data-slot="output">{{ submitted || "Not submitted" }}</output>
  </form>
</template>
