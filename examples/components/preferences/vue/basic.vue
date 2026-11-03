<script setup lang="ts">
import { createLocalStorage, createPreference } from "@ui-sdk/core"
import { Button } from "@ui-sdk/vue/button"
import { Preferences, usePreference } from "@ui-sdk/vue/preferences"

const density = createPreference({
  values: ["comfortable", "compact"],
  defaultValue: "comfortable",
  attribute: "data-density",
  storage: createLocalStorage("ui-sdk-preferences-density"),
})
const state = usePreference(density)
</script>

<template>
  <Preferences :preferences="[density]">
    <div data-slot="card">
      <Button
        :aria-pressed="state.value === 'compact'"
        @click="
          density.set(state.value === 'compact' ? 'comfortable' : 'compact', {
            reason: 'press',
            event: $event,
          })
        "
      >
        Compact layout
      </Button>
      <ul data-slot="list" aria-label="Documents">
        <li v-for="name in ['Project notes', 'Meeting notes', 'Release notes']" :key="name">
          {{ name }}
        </li>
      </ul>
      <span data-slot="hint">Density: {{ state.value }}</span>
    </div>
  </Preferences>
</template>
