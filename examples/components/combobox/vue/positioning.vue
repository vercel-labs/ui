<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import {
  Combobox,
  ComboboxArrow,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from "@ui-sdk/vue/combobox"
import { ref } from "vue"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "solidstart", label: "SolidStart" },
  { value: "qwik", label: "Qwik City" },
]

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

const side = ref<(typeof sides)[number]>("bottom")
const align = ref<(typeof aligns)[number]>("start")
const box = ref<HTMLDivElement | null>(null)
const anchored = ref(false)
</script>

<template>
  <div data-slot="stack">
    <div data-slot="stack">
      <div role="group" aria-label="Side" data-slot="row">
        <button
          v-for="value in sides"
          :key="value"
          type="button"
          :aria-pressed="side === value"
          @click="side = value"
        >
          {{ value }}
        </button>
      </div>
      <div role="group" aria-label="Align" data-slot="row">
        <button
          v-for="value in aligns"
          :key="value"
          type="button"
          :aria-pressed="align === value"
          @click="align = value"
        >
          {{ value }}
        </button>
      </div>
      <label data-slot="label">
        <input v-model="anchored" type="checkbox" />
        Anchor to the box
      </label>
    </div>
    <div ref="box" data-slot="card">
      <Combobox>
        <ComboboxInput aria-label="Framework" placeholder="Framework" />
        <ComboboxContent
          :side="side"
          :align="align"
          :side-offset="10"
          :align-offset="0"
          :collision-padding="16"
          :anchor="anchored ? box : null"
        >
          <ComboboxArrow />
          <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxItem
              v-for="framework in frameworks"
              :key="framework.value"
              :value="framework.value"
              :label="framework.label"
            >
              {{ framework.label }}
              <ComboboxItemIndicator>
                <CheckIcon />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  </div>
</template>
