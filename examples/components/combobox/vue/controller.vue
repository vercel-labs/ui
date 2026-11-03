<script setup lang="ts">
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  createComboboxController,
} from "@ui-sdk/vue/combobox"
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

const countryLabel = (value: string) => countries.find((country) => country.value === value)?.label ?? value

const country = createComboboxController<string>()
const log = ref("")

async function openCountry() {
  const { reason } = await country.open()
  log.value = `Closed by ${reason}, with ${country.getValue() ?? "nothing"}`
}

function search() {
  country.focus()
  country.setQuery("sw")
  country.open()
}
</script>

<template>
  <div data-slot="stack">
    <Combobox :controller="country" :item-to-label="countryLabel">
      <div data-slot="stack">
        <ComboboxLabel>Country</ComboboxLabel>
        <div data-slot="row">
          <ComboboxInput placeholder="Search countries" />
          <ComboboxTrigger aria-label="Show countries">
            <ChevronDownIcon />
          </ComboboxTrigger>
        </div>
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No countries found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxItem v-for="item in countries" :key="item.value" :value="item.value" :label="item.label">
            {{ item.label }}
            <ComboboxItemIndicator>
              <CheckIcon />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    <div data-slot="row">
      <button type="button" @click="openCountry">Open</button>
      <button type="button" @click="search">Search “sw”</button>
      <button type="button" @click="country.setValue('de')">Germany</button>
      <button type="button" @click="country.clear()">Clear</button>
    </div>
    <output data-slot="output">{{ log || "Use the buttons" }}</output>
  </div>
</template>
