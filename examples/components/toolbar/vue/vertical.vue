<script setup lang="ts">
import { ImageIcon, MoveHorizontalIcon, PencilIcon, TrashIcon } from "@lucide/vue"
import { Toggle, ToggleGroup } from "@ui-sdk/vue/toggle"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/vue/toolbar"
</script>

<template>
  <Toolbar orientation="vertical" aria-label="Tools">
    <ToggleGroup :default-value="['pencil']" aria-label="Tool" orientation="vertical">
      <Toggle data-variant="ghost" value="pencil" aria-label="Pencil">
        <PencilIcon />
      </Toggle>
      <Toggle data-variant="ghost" value="image" aria-label="Image">
        <ImageIcon />
      </Toggle>
      <Toggle data-variant="ghost" value="move" aria-label="Move">
        <MoveHorizontalIcon />
      </Toggle>
    </ToggleGroup>
    <ToolbarSeparator />
    <ToolbarButton data-variant="secondary" aria-label="Delete">
      <TrashIcon />
    </ToolbarButton>
  </Toolbar>
</template>
