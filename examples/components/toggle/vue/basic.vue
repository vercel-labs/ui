<script setup lang="ts">
import { BookmarkIcon } from "@lucide/vue"
import { Toggle, ToggleIcon } from "@ui-sdk/vue/toggle"
</script>

<template>
  <Toggle aria-label="Bookmark">
    <ToggleIcon data-variant="fill">
      <BookmarkIcon />
    </ToggleIcon>
  </Toggle>
</template>
