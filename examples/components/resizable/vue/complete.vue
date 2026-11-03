<script setup lang="ts">
import type { ResizableLayoutCommitDetails } from "@ui-sdk/vue/resizable"
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
import { ref } from "vue"

const moves = ref(0)
const saved = ref("nothing yet")

function save(layout: number[], details: ResizableLayoutCommitDetails) {
  saved.value = `${layout.map(Math.round).join(" / ")} after ${details.reason}`
}
</script>

<template>
  <div data-slot="stack">
    <Resizable @layout-change="moves++" @layout-commit="save">
      <ResizablePanel :default-size="40">Files</ResizablePanel>
      <ResizableHandle aria-label="Resize files" />
      <ResizablePanel>Editor</ResizablePanel>
    </Resizable>
    <output data-slot="output">{{ moves }} changes, saved {{ saved }}</output>
  </div>
</template>
