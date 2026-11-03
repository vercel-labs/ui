<script setup lang="ts">
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/vue/scroll-area"

const artworks = [
  { title: "Dunes at dusk" },
  { title: "Harbor fog" },
  { title: "Moss study" },
  { title: "Night market" },
  { title: "Salt flats" },
  { title: "Copper roofs" },
]
</script>

<template>
  <ScrollArea>
    <ScrollAreaViewport>
      <ScrollAreaContent>
        <figure v-for="artwork in artworks" :key="artwork.title">
          <div />
          <figcaption>{{ artwork.title }}</figcaption>
        </figure>
      </ScrollAreaContent>
    </ScrollAreaViewport>
    <ScrollAreaScrollbar orientation="horizontal">
      <ScrollAreaThumb />
    </ScrollAreaScrollbar>
  </ScrollArea>
</template>
