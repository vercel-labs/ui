<script setup lang="ts">
import { BookmarkIcon, HeartIcon, StarIcon } from "@lucide/vue"
import { Button } from "@ui-sdk/vue/button"
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <Button data-size="sm">Small</Button>
      <Button data-size="sm" aria-label="Bookmark">
        <BookmarkIcon />
      </Button>
    </div>
    <div data-slot="row">
      <Button>Default</Button>
      <Button aria-label="Favorite">
        <HeartIcon />
      </Button>
    </div>
    <div data-slot="row">
      <Button data-size="lg">Large</Button>
      <Button data-size="lg" aria-label="Star">
        <StarIcon />
      </Button>
    </div>
  </div>
</template>
