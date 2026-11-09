<script setup lang="ts">
import { createTreeController, Tree } from "@ui-sdk/vue"
import { describeTree, treeFixture } from "tests/fixtures/tree.ts"
import { treeOptions } from "tests/fixtures/page.ts"
import { ref } from "vue"
import TreeFixtureItems from "./TreeFixtureItems.vue"

const controller = createTreeController()
const { cancel, ...options } = treeOptions()

const action = ref("")

function onExpandedChange(expanded: string[], details: { cancel: () => void }) {
  if (cancel && expanded.includes(cancel) && !controller.isExpanded(cancel)) {
    return details.cancel()
  }
  action.value = describeTree("expanded", expanded)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Tree
      class="tree"
      :aria-label="treeFixture.label"
      :items="treeFixture.items"
      v-bind="options"
      :controller="controller"
      :on-action="
        (value: string) => {
          action = describeTree('action', value)
        }
      "
      @value-change="
        (value: string | string[] | null) =>
          (action = describeTree('selected', value))
      "
      @expanded-change="onExpandedChange"
      @checked-change="
        (checked: string[]) => (action = describeTree('checked', checked))
      "
    >
      <TreeFixtureItems
        :items="treeFixture.items"
        :checkable="options.checkable"
      />
    </Tree>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <button @click="controller.expandAll()">Expand all</button>
    <button @click="controller.collapseAll()">Collapse all</button>
    <button @click="controller.reveal('dialog.tsx')">Reveal dialog</button>
  </div>
</template>
