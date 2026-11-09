<script setup lang="ts">
import { Meter, MeterIndicator, MeterTrack, MeterValue } from "@ui-sdk/vue"
import { ref } from "vue"

// Parts rendered as other elements, and from their state.
const value = ref(40)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Meter :value="value" aria-label="Memory">
      <template #render="{ props, state }">
        <section
          v-bind="props"
          :class="`gauge ${state.percent >= 80 ? 'is-high' : 'is-ok'}`"
        >
          <MeterValue v-slot="{ state: valueState }"
            >{{ valueState.text }} used</MeterValue
          >
          <MeterTrack class="gauge-track"
            ><MeterIndicator class="gauge-indicator"
          /></MeterTrack>
        </section>
      </template>
    </Meter>
    <button @click="value = 90">Fill</button>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
  </div>
</template>
