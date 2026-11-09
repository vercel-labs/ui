<script setup lang="ts">
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteTrigger,
} from "@ui-sdk/vue"
import { autocompleteFixture as f } from "tests/fixtures/autocomplete.ts"
</script>

<!-- Parts rendered as other elements, with render slots and class names of state. -->
<template>
  <div class="fixture">
    <button>Before</button>
    <Autocomplete :name="f.name">
      <AutocompleteLabel class="label">{{ f.label }}</AutocompleteLabel>
      <AutocompleteInput>
        <template #render="{ props, state }">
          <input
            v-bind="props"
            :class="['input', state.open ? 'is-open' : 'is-closed']"
          />
        </template>
      </AutocompleteInput>
      <AutocompleteTrigger :aria-label="f.trigger">▾</AutocompleteTrigger>
      <AutocompleteContent class="popup list-popup">
        <AutocompleteList>
          <AutocompleteItem class="item" value="docs" label="Docs" href="#docs">
            <template #render="{ props }">
              <a v-bind="props">Docs</a>
            </template>
          </AutocompleteItem>
          <AutocompleteItem
            v-for="item in f.items.slice(0, 3)"
            :key="item.value"
            v-slot="{ state }"
            class="item"
            :value="item.value"
            :label="item.label"
          >
            {{ item.label }}{{ state.highlighted ? " ←" : "" }}
          </AutocompleteItem>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
    <button>After</button>
  </div>
</template>
