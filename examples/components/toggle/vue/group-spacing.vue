<script setup lang="ts">
import { BoldIcon, BookmarkIcon, HeartIcon, ItalicIcon, StarIcon, UnderlineIcon } from "@lucide/vue"
import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/vue/toggle"

const formatting = [
  { value: "bold", label: "Bold", icon: BoldIcon },
  { value: "italic", label: "Italic", icon: ItalicIcon },
  { value: "underline", label: "Underline", icon: UnderlineIcon },
]

const favorites = [
  { value: "star", label: "Star", icon: StarIcon },
  { value: "heart", label: "Heart", icon: HeartIcon },
  { value: "bookmark", label: "Bookmark", icon: BookmarkIcon },
]
</script>

<template>
  <div data-slot="stack">
    <ToggleGroup multiple aria-label="Text formatting">
      <Toggle v-for="item in formatting" :key="item.value" :value="item.value" :aria-label="item.label">
        <ToggleIcon>
          <component :is="item.icon" />
        </ToggleIcon>
      </Toggle>
    </ToggleGroup>
    <ToggleGroup multiple data-variant="spaced" aria-label="Favorites">
      <Toggle v-for="item in favorites" :key="item.value" :value="item.value" data-variant="outline">
        <ToggleIcon data-variant="fill">
          <component :is="item.icon" />
        </ToggleIcon>
        {{ item.label }}
      </Toggle>
    </ToggleGroup>
  </div>
</template>
