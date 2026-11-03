<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/vue/listbox"
import { ref } from "vue"

const timezones = Array.from({ length: 27 }, (_, index) => {
  const offset = index - 12
  const label = `UTC${offset < 0 ? "−" : "+"}${String(Math.abs(offset)).padStart(2, "0")}:00`
  return { value: `utc${offset}`, label }
})

const highlighted = ref<unknown>(null)
</script>

<template>
  <div data-slot="stack">
    <Listbox default-value="utc9" aria-label="Time zone" @highlight="(value) => (highlighted = value)">
      <ListboxItem v-for="(zone, index) in timezones" :key="zone.value" :value="zone.value" :index="index">
        {{ zone.label }}
        <ListboxItemIndicator>
          <CheckIcon aria-hidden="true" />
        </ListboxItemIndicator>
      </ListboxItem>
    </Listbox>
    <output data-slot="output">Focused: {{ highlighted ?? "none" }}</output>
  </div>
</template>
