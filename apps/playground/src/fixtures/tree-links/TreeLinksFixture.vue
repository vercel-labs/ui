<script setup lang="ts">
import { Tree } from "@ui-sdk/vue"
import { treeLinksFixture } from "tests/fixtures/tree.ts"
import { onBeforeUnmount, ref } from "vue"
import TreeFixtureItems from "../tree/TreeFixtureItems.vue"

// A tree of links, rendered with the tree fixture's classes. The current page follows the address.
const current = ref(location.hash.slice(1) || "usage")
const changed = () => (current.value = location.hash.slice(1))
window.addEventListener("hashchange", changed)
onBeforeUnmount(() => window.removeEventListener("hashchange", changed))
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Tree
      class="tree"
      :aria-label="treeLinksFixture.label"
      :items="treeLinksFixture.items"
      mode="none"
      :current="current"
    >
      <TreeFixtureItems :items="treeLinksFixture.items" :checkable="false" />
    </Tree>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ current }}</output>
  </div>
</template>
