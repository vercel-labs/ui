<script setup lang="ts">
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/vue"
import { comboboxFixture as f } from "tests/fixtures/combobox.ts"
</script>

<!-- Parts rendered as other elements, with render slots and class names of state. -->
<template>
  <div class="fixture">
    <button>Before</button>
    <Combobox :name="f.name">
      <ComboboxLabel class="label">{{ f.label }}</ComboboxLabel>
      <ComboboxInput>
        <template #render="{ props, state }">
          <input
            v-bind="props"
            :class="['input', state.open ? 'is-open' : 'is-closed']"
          />
        </template>
      </ComboboxInput>
      <ComboboxTrigger :aria-label="f.trigger">▾</ComboboxTrigger>
      <ComboboxContent class="popup list-popup">
        <ComboboxList>
          <ComboboxItem class="item" value="docs" label="Docs" href="#docs">
            <template #render="{ props }">
              <a v-bind="props">Docs</a>
            </template>
          </ComboboxItem>
          <ComboboxItem
            v-for="item in f.items.slice(0, 3)"
            :key="item.value"
            class="item"
            :value="item.value"
            :label="item.label"
            v-slot="{ state }"
          >
            {{ item.label }}{{ state.highlighted ? " ←" : "" }}
          </ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    <button>After</button>
  </div>
</template>
