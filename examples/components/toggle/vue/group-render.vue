<script setup lang="ts">
import { BookmarkIcon, HeartIcon, StarIcon } from "@lucide/vue"
import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/vue/toggle"

const reactions = [
  { value: "star", label: "Favorite", icon: StarIcon },
  { value: "heart", label: "Like", icon: HeartIcon },
  { value: "bookmark", label: "Save", icon: BookmarkIcon },
]
</script>

<template>
  <ToggleGroup multiple aria-label="Reactions" data-variant="framed">
    <Toggle v-for="item in reactions" :key="item.value" :value="item.value" :aria-label="item.label">
      <template #render="{ props, state }">
        <button v-bind="props">
          <ToggleIcon>
            <component :is="item.icon" :fill="state.pressed ? 'currentColor' : 'none'" />
          </ToggleIcon>
        </button>
      </template>
    </Toggle>
  </ToggleGroup>
</template>
