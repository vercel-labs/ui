<script setup lang="ts">
import { Button, Separator, Toggle, ToggleGroup } from "@ui-sdk/vue"
import { ref } from "vue"

const action = ref("")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Button class="button" @click="action = 'span'">
      <template #render="{ props }">
        <span v-bind="props">Span button</span>
      </template>
    </Button>
    <Button class="button" disabled href="#old">
      <template #render="{ props }">
        <a v-bind="props">Old docs</a>
      </template>
    </Button>
    <Toggle
      @pressed-change="(pressed) => (action = pressed ? 'star' : 'unstar')"
    >
      <template #render="{ props, state }">
        <button
          v-bind="props"
          :class="['toggle', state.pressed ? 'is-pressed' : 'is-unpressed']"
        >
          <span aria-hidden="true">{{ state.pressed ? "★" : "☆" }}</span> Star
        </button>
      </template>
    </Toggle>
    <ToggleGroup
      class="toggle-group"
      aria-label="View"
      :default-value="['grid']"
      @value-change="(value) => (action = value.join(', '))"
    >
      <Toggle class="toggle" value="grid">
        <template #render="{ props }">
          <span v-bind="props">Grid</span>
        </template>
      </Toggle>
      <Toggle class="toggle" value="list">
        <template #render="{ props }">
          <span v-bind="props">List</span>
        </template>
      </Toggle>
    </ToggleGroup>
    <Separator class="rule">
      <template #render="{ props }">
        <hr v-bind="props" />
      </template>
    </Separator>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
