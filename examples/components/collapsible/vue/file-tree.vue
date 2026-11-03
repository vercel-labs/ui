<script setup lang="ts">
import { ChevronRightIcon, FileIcon, FolderIcon } from "@lucide/vue"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/vue/collapsible"

type TreeNode = { name: string; children?: TreeNode[] }

defineProps<{ nodes?: TreeNode[] }>()

const fileTree: TreeNode[] = [
  {
    name: "components",
    children: [
      { name: "ui", children: [{ name: "button.tsx" }, { name: "card.tsx" }, { name: "dialog.tsx" }] },
      { name: "header.tsx" },
      { name: "footer.tsx" },
    ],
  },
  { name: "lib", children: [{ name: "utils.ts" }] },
  { name: "hooks", children: [{ name: "use-media-query.ts" }, { name: "use-mobile.ts" }] },
  { name: "types", children: [{ name: "index.d.ts" }] },
  { name: "public", children: [{ name: "favicon.ico" }, { name: "logo.svg" }] },
  { name: "app.tsx" },
  { name: "layout.tsx" },
  { name: "globals.css" },
  { name: "package.json" },
  { name: "tsconfig.json" },
  { name: "README.md" },
  { name: ".gitignore" },
]
</script>

<template>
  <div v-if="!nodes">
    <FileTree :nodes="fileTree" />
  </div>
  <ul v-else>
    <li v-for="node in nodes" :key="node.name">
      <Collapsible v-if="node.children" :default-open="node.name === 'components'">
        <CollapsibleTrigger data-variant="ghost">
          <ChevronRightIcon />
          <FolderIcon />
          <span>{{ node.name }}</span>
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <FileTree :nodes="node.children" />
        </CollapsiblePanel>
      </Collapsible>
      <span data-slot="row" v-else>
        <FileIcon />
        {{ node.name }}
      </span>
    </li>
  </ul>
</template>
