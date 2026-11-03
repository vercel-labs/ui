<script setup lang="ts">
import { CheckIcon, ChevronDownIcon, XIcon } from "@lucide/vue"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
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

const labels = ["Bug", "Feature", "Documentation", "Design", "Performance", "Security", "Testing"]

const submitted = ref("")

function submit(event: Event) {
  const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
    ([name, value]) => `${name}=${value}`,
  )
  submitted.value = data.join("&")
}
</script>

<template>
  <div data-slot="stack">
    <form id="combobox-profile" data-slot="stack" @submit.prevent="submit" @reset="submitted = ''">
      <Combobox name="country" required :item-to-label="countryLabel">
        <div data-slot="stack">
          <ComboboxLabel>Country</ComboboxLabel>
          <div data-slot="row">
            <ComboboxInput placeholder="Search countries" />
            <ComboboxTrigger aria-label="Show countries">
              <ChevronDownIcon aria-hidden="true" />
            </ComboboxTrigger>
          </div>
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
      <Combobox name="interests" multiple :default-value="['Design']">
        <div data-slot="stack">
          <ComboboxLabel>Interests</ComboboxLabel>
          <ComboboxChips>
            <ComboboxValue v-slot="{ value }">
              <ComboboxChip v-for="label in value as string[]" :key="label" :value="label">
                {{ label }}
                <ComboboxChipRemove :aria-label="`Remove ${label}`">
                  <XIcon aria-hidden="true" />
                </ComboboxChipRemove>
              </ComboboxChip>
            </ComboboxValue>
            <ComboboxInput placeholder="Add interests" />
          </ComboboxChips>
        </div>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem v-for="label in labels" :key="label" :value="label">
              {{ label }}
              <ComboboxItemIndicator>
                <CheckIcon aria-hidden="true" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
    <Combobox name="timezone" form="combobox-profile" default-value="Paris">
      <div data-slot="stack">
        <ComboboxLabel>City</ComboboxLabel>
        <div data-slot="row">
          <ComboboxInput />
          <ComboboxTrigger aria-label="Show cities">
            <ChevronDownIcon aria-hidden="true" />
          </ComboboxTrigger>
        </div>
      </div>
      <ComboboxContent>
        <ComboboxList>
          <ComboboxItem v-for="city in ['London', 'Paris', 'Berlin', 'Madrid']" :key="city" :value="city">
            {{ city }}
            <ComboboxItemIndicator>
              <CheckIcon aria-hidden="true" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    <output data-slot="output">{{ submitted || "Submit the form" }}</output>
  </div>
</template>
