<script setup lang="ts">
import { createToolbarController, Toolbar, ToolbarButton } from "@ui-sdk/vue/toolbar"
import { useShortcut } from "@ui-sdk/vue/shortcuts"
import { ref } from "vue"

const toolbar = createToolbarController()

const action = ref("nothing yet")
useShortcut("alt+f10", () => toolbar.focus(), { allowInInput: true })
</script>

<template>
  <div data-slot="stack">
    <textarea aria-label="Notes" placeholder="Type, then press Alt+F10" />
    <Toolbar :controller="toolbar" aria-label="Notes">
      <ToolbarButton
        data-variant="secondary"
        v-for="label in ['Bold', 'Italic', 'Link']"
        :key="label"
        @click="action = label.toLowerCase()"
      >
        {{ label }}
      </ToolbarButton>
    </Toolbar>
    <div data-slot="row">
      <button data-variant="secondary" type="button" @click="toolbar.focus()">Focus toolbar</button>
      <output data-slot="output">Last: {{ action }}</output>
    </div>
  </div>
</template>
