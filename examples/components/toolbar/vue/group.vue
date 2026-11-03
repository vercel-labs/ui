<script setup lang="ts">
import { CopyIcon, DownloadIcon, RedoIcon, UndoIcon } from "@lucide/vue"
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from "@ui-sdk/vue/toolbar"
</script>

<template>
  <Toolbar aria-label="Editor">
    <ToolbarGroup aria-label="Clipboard">
      <ToolbarButton data-variant="secondary" aria-label="Copy">
        <CopyIcon />
      </ToolbarButton>
      <ToolbarButton data-variant="secondary" aria-label="Download">
        <DownloadIcon />
      </ToolbarButton>
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup disabled aria-label="History">
      <ToolbarButton data-variant="secondary" aria-label="Undo">
        <UndoIcon />
      </ToolbarButton>
      <ToolbarButton data-variant="secondary" aria-label="Redo">
        <RedoIcon />
      </ToolbarButton>
    </ToolbarGroup>
  </Toolbar>
</template>
