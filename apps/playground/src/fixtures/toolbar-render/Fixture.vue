<script setup lang="ts">
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/vue"
import { ref } from "vue"

// How many times each item's content rendered, so specs can check that moving
// focus renders only the items whose tab stop moved.
const renders: Record<string, number> = {}
;(window as unknown as { __renders: typeof renders }).__renders = renders
const counted = (name: string) => {
  renders[name] = (renders[name] ?? 0) + 1
  return name
}
const action = ref("")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Toolbar class="toolbar" aria-label="Tools">
      <ToolbarButton @click="action = 'span'">
        <template #render="{ props }">
          <span v-bind="props">{{ counted("Span tool") }}</span>
        </template>
      </ToolbarButton>
      <ToolbarButton @click="action = 'cut'">{{
        counted("Cut")
      }}</ToolbarButton>
      <ToolbarButton @click="action = 'copy'">{{
        counted("Copy")
      }}</ToolbarButton>
      <ToolbarSeparator class="rule">
        <template #render="{ props }">
          <hr v-bind="props" />
        </template>
      </ToolbarSeparator>
      <ToolbarButton disabled href="#old">
        <template #render="{ props, state }">
          <a
            v-bind="props"
            href="#old"
            :class="state.disabled ? 'is-disabled' : 'is-enabled'"
            >Old docs</a
          >
        </template>
      </ToolbarButton>
    </Toolbar>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
