<script setup lang="ts">
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/vue/combobox"
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import { ref } from "vue"

const countries = [
  { value: "ar", label: "Argentina" },
  { value: "au", label: "Australia" },
  { value: "at", label: "Austria" },
  { value: "be", label: "Belgium" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "cl", label: "Chile" },
  { value: "dk", label: "Denmark" },
  { value: "fi", label: "Finland" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "gr", label: "Greece" },
  { value: "jp", label: "Japan" },
  { value: "nl", label: "Netherlands" },
  { value: "es", label: "Spain" },
  { value: "se", label: "Sweden" },
  { value: "ch", label: "Switzerland" },
]

const submitted = ref("")

function submit(event: Event) {
  submitted.value = `Shipping to ${new FormData(event.currentTarget as HTMLFormElement).get("country")}.`
}
</script>

<template>
  <form data-slot="stack" @submit.prevent="submit">
    <Field name="country">
      <FieldLabel>Country</FieldLabel>
      <Combobox required>
        <div data-slot="row">
          <ComboboxInput placeholder="Search countries" />
          <ComboboxTrigger aria-label="Show countries">
            <ChevronDownIcon aria-hidden="true" />
          </ComboboxTrigger>
        </div>
        <ComboboxContent>
          <ComboboxEmpty>No countries found.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxItem
              v-for="country in countries"
              :key="country.value"
              :value="country.value"
              :label="country.label"
            >
              {{ country.label }}
              <ComboboxItemIndicator>
                <CheckIcon aria-hidden="true" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldDescription>Where we ship your order.</FieldDescription>
      <div>
        <FieldError match="valueMissing">Choose a country.</FieldError>
      </div>
    </Field>
    <button type="submit" data-variant="solid">Continue</button>
    <output data-slot="output">{{ submitted }}</output>
  </form>
</template>
