<script setup lang="ts">
import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@ui-sdk/vue"
import { perfSize } from "tests/fixtures/perf.ts"

// A tree of N folders of two files each, like a long file explorer, for the
// count gates. Every folder starts collapsed.
const folders = Array.from({ length: perfSize(200) }, (_, index) => index + 1)
</script>

<template>
  <div class="fixture" style="flex-direction: column; align-items: start">
    <button>Before</button>
    <Tree class="tree" aria-label="Folders">
      <TreeItem
        v-for="n in folders"
        :key="n"
        class="tree-item"
        :value="`folder-${n}`"
      >
        <TreeItemLabel class="tree-label">Folder {{ n }}</TreeItemLabel>
        <TreeGroup class="tree-group">
          <TreeItem class="tree-item" :value="`folder-${n}/a`">
            <TreeItemLabel class="tree-label">File {{ n }}a</TreeItemLabel>
          </TreeItem>
          <TreeItem class="tree-item" :value="`folder-${n}/b`">
            <TreeItemLabel class="tree-label">File {{ n }}b</TreeItemLabel>
          </TreeItem>
        </TreeGroup>
      </TreeItem>
    </Tree>
    <button>After</button>
  </div>
</template>
