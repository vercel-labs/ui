<script setup lang="ts">
import { icons, type IconName } from "tests/fixtures/item-icons.ts"

// An entry's icon: its SVG, with its title, or its emoji.
defineProps<{ entry: { icon?: IconName; emoji?: string } }>()
</script>

<template>
  <svg
    v-if="entry.icon"
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
  >
    <title>{{ icons[entry.icon].title }}</title>
    <path :d="icons[entry.icon].path" />
  </svg>
  <template v-else>{{ entry.emoji }}</template>
</template>
