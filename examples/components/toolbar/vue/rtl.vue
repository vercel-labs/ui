<script setup lang="ts">
import { BoldIcon, ItalicIcon } from "@lucide/vue"
import { Toggle, ToggleGroup } from "@ui-sdk/vue/toggle"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/vue/toolbar"
</script>

<template>
  <div dir="rtl">
    <Toolbar aria-label="تنسيق">
      <ToggleGroup multiple aria-label="نمط النص">
        <Toggle data-variant="ghost" value="bold" aria-label="غامق">
          <BoldIcon />
        </Toggle>
        <Toggle data-variant="ghost" value="italic" aria-label="مائل">
          <ItalicIcon />
        </Toggle>
      </ToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton data-variant="secondary">حفظ</ToolbarButton>
    </Toolbar>
  </div>
</template>
