<script setup lang="ts">
import { Bookmark, Heart, Star } from "@lucide/vue"
import { Button } from "@ui-sdk/vue/button"
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <Button data-size="sm">Small</Button>
      <Button data-size="sm" aria-label="Bookmark">
        <Bookmark />
      </Button>
    </div>
    <div data-slot="row">
      <Button>Default</Button>
      <Button aria-label="Favorite">
        <Heart />
      </Button>
    </div>
    <div data-slot="row">
      <Button data-size="lg">Large</Button>
      <Button data-size="lg" aria-label="Star">
        <Star />
      </Button>
    </div>
  </div>
</template>
