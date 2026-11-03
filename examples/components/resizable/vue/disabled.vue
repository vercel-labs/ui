<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
import { ref } from "vue"

const disabled = ref(false)
</script>

<template>
  <div data-slot="stack">
    <Resizable :disabled="disabled">
      <ResizablePanel>Fixed</ResizablePanel>
      <ResizableHandle disabled aria-label="Resize fixed" />
      <ResizablePanel>Two</ResizablePanel>
      <ResizableHandle aria-label="Resize two" />
      <ResizablePanel>Three</ResizablePanel>
    </Resizable>
    <label data-slot="label">
      <input v-model="disabled" type="checkbox" />
      Disable the group
    </label>
  </div>
</template>
