<script setup lang="ts">
import {
  createResizableController,
  Resizable,
  ResizableHandle,
  ResizablePanel,
  type ResizableLayoutCommitDetails,
  type ResizableLayoutChangeDetails,
} from "@ui-sdk/vue"
import {
  formatLayout,
  resizableFixture as f,
  resizableOptions,
} from "tests/fixtures/resizable.ts"
import { ref } from "vue"

const options = resizableOptions()
const controller = createResizableController()
const { sidebar, main, preview } = f.editor.panels
const { code, terminal } = f.main.panels
const action = ref("")
const committed = ref<string[]>([])
const layout = ref([25, 50, 25])

// Records a change, or cancels it when the URL asks. `v-model` follows unless canceled.
function report(
  group: string,
  next: number[],
  details: ResizableLayoutChangeDetails
) {
  if (group === f.editor.id && options.cancel) {
    return details.cancel()
  }
  action.value = formatLayout(group, next, details.reason)
}

function commit(
  group: string,
  next: number[],
  details: ResizableLayoutCommitDetails
) {
  committed.value = [
    ...committed.value,
    formatLayout(group, next, details.reason),
  ]
}

const editor = {
  change: (next: number[], details: ResizableLayoutChangeDetails) =>
    report(f.editor.id, next, details),
  complete: (next: number[], details: ResizableLayoutCommitDetails) =>
    commit(f.editor.id, next, details),
}
const area = {
  change: (next: number[], details: ResizableLayoutChangeDetails) =>
    report(f.main.id, next, details),
  complete: (next: number[], details: ResizableLayoutCommitDetails) =>
    commit(f.main.id, next, details),
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Resizable
      :layout="options.controlled ? layout : undefined"
      @update:layout="(next) => !options.ignore && (layout = next)"
      class="resizable"
      :orientation="options.orientation"
      :disabled="options.disabled"
      :step="options.step"
      :large-step="options.largeStep"
      :auto-save-id="options.autoSaveId"
      :default-layout="options.defaultLayout"
      :controller="controller"
      @layout-change="editor.change"
      @layout-commit="editor.complete"
    >
      <ResizablePanel
        :id="sidebar.id"
        :default-size="sidebar.defaultSize"
        :min-size="sidebar.minSize"
        :max-size="sidebar.maxSize"
        :collapsible="sidebar.collapsible"
        class="resizable-panel"
        role="group"
        :aria-label="sidebar.label"
      >
        <button>Sidebar action</button>
      </ResizablePanel>
      <ResizableHandle
        class="resizable-handle"
        :aria-label="f.editor.handles[0]"
        :disabled="options.locked"
      />
      <ResizablePanel
        :id="main.id"
        :min-size="main.minSize"
        class="resizable-panel"
        role="group"
        :aria-label="main.label"
      >
        <Resizable
          class="resizable-nested"
          orientation="vertical"
          @layout-change="area.change"
          @layout-commit="area.complete"
        >
          <ResizablePanel
            :id="code.id"
            :default-size="code.defaultSize"
            :min-size="code.minSize"
            class="resizable-panel"
            role="group"
            :aria-label="code.label"
          />
          <ResizableHandle
            class="resizable-handle"
            :aria-label="f.main.handle"
          />
          <ResizablePanel
            :id="terminal.id"
            :min-size="terminal.minSize"
            :collapsible="terminal.collapsible"
            class="resizable-panel"
            role="group"
            :aria-label="terminal.label"
          />
        </Resizable>
      </ResizablePanel>
      <ResizableHandle
        class="resizable-handle"
        :aria-label="f.editor.handles[1]"
      />
      <ResizablePanel
        :id="preview.id"
        :default-size="preview.defaultSize"
        :min-size="preview.minSize"
        class="resizable-panel"
        role="group"
        :aria-label="preview.label"
      />
    </Resizable>
    <div class="row">
      <button @click="controller.collapse(sidebar.id)">
        {{ f.buttons.collapse }}
      </button>
      <button @click="controller.expand(sidebar.id)">
        {{ f.buttons.expand }}
      </button>
      <button @click="controller.resize(preview.id, f.previewSize)">
        {{ f.buttons.resize }}
      </button>
    </div>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output role="status" aria-label="Committed">{{
      committed.join(" ")
    }}</output>
  </div>
</template>
