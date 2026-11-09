<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue"
import { ref } from "vue"

// How often the first panel's slot rendered, for specs that check a drag
// renders nothing that doesn't read the size.
const counts = { renders: 0 }
Object.assign(window, { panelRenders: counts })
const action = ref("")

function count() {
  counts.renders++
  return true
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Resizable
      class="resizable"
      @layout-commit="(layout) => (action = `layout:${layout.map(Math.round)}`)"
    >
      <ResizablePanel
        v-slot="{ state }"
        :default-size="30"
        collapsible
        :min-size="10"
        class="resizable-panel"
        role="group"
        aria-label="Files"
      >
        <span v-if="count()" class="panel-state">{{
          state.collapsed ? "Collapsed" : "Open"
        }}</span>
      </ResizablePanel>
      <ResizableHandle aria-label="Resize files" class="resizable-handle">
        <template #render="{ props, state }">
          <span v-bind="props">
            <span class="handle-state">{{
              state.dragging ? "dragging" : "idle"
            }}</span>
          </span>
        </template>
      </ResizableHandle>
      <ResizablePanel
        v-slot="{ state }"
        class="resizable-panel"
        role="group"
        aria-label="Editor"
      >
        <span class="panel-size">{{ Math.round(state.size) }}</span>
      </ResizablePanel>
    </Resizable>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
