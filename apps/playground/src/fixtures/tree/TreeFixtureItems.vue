<script setup lang="ts">
import {
  TreeGroup,
  TreeItem,
  TreeItemCheckbox,
  TreeItemIndicator,
  TreeItemLabel,
} from "@ui-sdk/vue"
import type { TreeFixtureItem } from "tests/fixtures/tree.ts"

defineProps<{ items: TreeFixtureItem[]; checkable: boolean }>()
</script>

<template>
  <TreeItem
    v-for="item in items"
    :key="item.value"
    class="tree-item"
    :value="item.value"
    :disabled="item.disabled"
  >
    <TreeItemIndicator v-if="item.children" class="tree-indicator"
      >▸</TreeItemIndicator
    >
    <TreeItemCheckbox v-if="checkable" class="tree-checkbox" />
    <TreeItemLabel class="tree-label">
      <template v-if="item.href" #render="{ props }">
        <a v-bind="props" :href="item.href">{{ item.label }}</a>
      </template>
      <template #default>{{ item.label }}</template>
    </TreeItemLabel>
    <TreeGroup v-if="item.children" class="tree-group">
      <TreeFixtureItems :items="item.children" :checkable="checkable" />
    </TreeGroup>
  </TreeItem>
</template>
