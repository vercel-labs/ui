<script setup lang="ts">
import { createResizableController, Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
import { ref } from "vue"

const editor = createResizableController()
const reading = ref("")

function read() {
  reading.value = `${editor.getLayout().map(Math.round).join(" / ")}${editor.isCollapsed(0) ? ", collapsed" : ""}`
}
</script>

<template>
  <div data-slot="stack">
    <Resizable :controller="editor">
      <ResizablePanel id="controller-sidebar" :default-size="30" :min-size="20" collapsible>
        Sidebar
      </ResizablePanel>
      <ResizableHandle aria-label="Resize sidebar" />
      <ResizablePanel>Editor</ResizablePanel>
    </Resizable>
    <div data-slot="row">
      <button data-variant="secondary" type="button" @click="editor.collapse('controller-sidebar')">
        Collapse
      </button>
      <button data-variant="secondary" type="button" @click="editor.expand('controller-sidebar')">
        Expand
      </button>
      <button data-variant="secondary" type="button" @click="editor.resize('controller-sidebar', '240px')">
        240px
      </button>
      <button data-variant="secondary" type="button" @click="read">Read</button>
    </div>
    <output data-slot="output" v-if="reading">{{ reading }}</output>
  </div>
</template>
