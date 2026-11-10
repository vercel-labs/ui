<script setup lang="ts">
import {
  Waterfall,
  WaterfallBar,
  WaterfallCell,
  WaterfallIndicator,
  WaterfallRow,
  WaterfallRowHeader,
} from "@ui-sdk/vue"
import { countRender, perfSize } from "tests/fixtures/perf.ts"
import { flatWaterfall, longTrace } from "tests/fixtures/waterfall.ts"

// A trace of N requests of two spans each, every row rendered, for the count
// gates. Every request starts collapsed, so its spans render hidden.
const trace = longTrace(perfSize(200))
const spans = flatWaterfall(trace)
const count = (part: "row" | "bar") => (countRender(part), "")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Waterfall aria-label="Long trace" :items="trace">
      <WaterfallRow v-for="span in spans" :key="span.value" :value="span.value">
        <template #render="{ props }">
          <div v-bind="props">
            {{ count("row") }}
            <WaterfallRowHeader>
              <WaterfallIndicator v-if="span.children" />{{ span.label }}
            </WaterfallRowHeader>
            <WaterfallCell>{{ span.status }}</WaterfallCell>
            <WaterfallBar>
              <template #render="{ props: bar }">
                <div v-bind="bar">{{ count("bar") }}</div>
              </template>
            </WaterfallBar>
          </div>
        </template>
      </WaterfallRow>
    </Waterfall>
    <button>After</button>
  </div>
</template>
