<script setup lang="ts">
import { PauseIcon, PlayIcon } from "@lucide/vue"
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselPlayToggle,
  CarouselViewport,
} from "@ui-sdk/vue/carousel"
import { ref } from "vue"

const photos = [
  { name: "Dunes" },
  { name: "Forest" },
  { name: "Glacier" },
  { name: "Canyon" },
  { name: "Meadow" },
  { name: "Harbor" },
]

const log = ref("")
</script>

<template>
  <Carousel
    aria-label="Photos"
    default-playing
    :interval="4000"
    @playing-change="
      (playing: boolean, details: { reason: string }) =>
        (log = `${playing ? 'Playing' : 'Stopped'} (${details.reason})`)
    "
  >
    <CarouselViewport>
      <CarouselContent>
        <CarouselItem v-for="photo in photos" :key="photo.name">
          <div data-slot="tile">
            {{ photo.name }}
          </div>
        </CarouselItem>
      </CarouselContent>
    </CarouselViewport>
    <div data-slot="row">
      <CarouselPlayToggle data-variant="secondary" v-slot="{ state }">
        <template v-if="state.playing">
          <PauseIcon />
          <span data-slot="visually-hidden">Stop slide rotation</span>
        </template>
        <template v-else>
          <PlayIcon />
          <span data-slot="visually-hidden">Start slide rotation</span>
        </template>
      </CarouselPlayToggle>
      <CarouselIndicatorGroup aria-label="Choose a photo">
        <CarouselIndicator
          v-for="(photo, index) in photos"
          :key="photo.name"
          :page="index + 1"
          :aria-label="photo.name"
        >
          <span />
        </CarouselIndicator>
      </CarouselIndicatorGroup>
    </div>
    <p data-slot="hint" aria-live="polite">{{ log }}</p>
  </Carousel>
</template>
