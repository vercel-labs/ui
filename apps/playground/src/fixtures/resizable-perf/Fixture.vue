<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue"
import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A group of N panels for the counts specs. The first two take
// a quarter each and the rest share the other half, so the first handle has
// room to move. Every other panel reads its size in its render slot, so
// specs can tell plain panels' renders from watched ones. The second panel,
// which the first handle resizes, is a watched one.
const panels = perfItems(perfSize())
const count = (kind: "watched" | "plain" | "handle") => (countRender(kind), "")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Resizable class="resizable-perf">
      <template v-for="(panel, index) in panels" :key="panel.value">
        <ResizableHandle
          v-if="index > 0"
          class="resizable-perf-handle"
          :aria-label="`Handle ${index}`"
        >
          <template #render="{ props }">
            <div v-bind="props">{{ count("handle") }}</div>
          </template>
        </ResizableHandle>
        <ResizablePanel
          v-if="index % 2"
          :id="panel.value"
          :default-size="index < 2 ? 25 : undefined"
          class="resizable-panel"
        >
          <template #render="{ props, state }">
            <div v-bind="props" :data-size="Math.round(state.size)">
              {{ count("watched") }}{{ panel.label }}
            </div>
          </template>
        </ResizablePanel>
        <ResizablePanel
          v-else
          :id="panel.value"
          :default-size="index < 2 ? 25 : undefined"
          class="resizable-panel"
        >
          <template #render="{ props }">
            <div v-bind="props">{{ count("plain") }}{{ panel.label }}</div>
          </template>
        </ResizablePanel>
      </template>
    </Resizable>
    <button>After</button>
  </div>
</template>
