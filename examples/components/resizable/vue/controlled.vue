<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
import { ref } from "vue"

const layout = ref([30, 70])
</script>

<template>
  <div data-slot="stack">
    <Resizable v-model:layout="layout">
      <ResizablePanel :min-size="20">Files</ResizablePanel>
      <ResizableHandle aria-label="Resize files" />
      <ResizablePanel :min-size="20">Editor</ResizablePanel>
    </Resizable>
    <div data-slot="row">
      <button data-variant="secondary" type="button" @click="layout = [20, 80]">Narrow</button>
      <button data-variant="secondary" type="button" @click="layout = [50, 50]">Even</button>
    </div>
    <output data-slot="output">{{ layout.map(Math.round).join(" / ") }}</output>
  </div>
</template>
