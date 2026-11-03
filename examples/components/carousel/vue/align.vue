<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/vue"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/vue/carousel"

const photos = [
  { name: "Dunes" },
  { name: "Forest" },
  { name: "Glacier" },
  { name: "Canyon" },
  { name: "Meadow" },
  { name: "Harbor" },
]
</script>

<template>
  <Carousel aria-label="Photos" align="center">
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
      <CarouselPrevious data-variant="secondary" aria-label="Previous slide">
        <ChevronLeftIcon />
      </CarouselPrevious>
      <CarouselNext data-variant="secondary" aria-label="Next slide">
        <ChevronRightIcon />
      </CarouselNext>
    </div>
  </Carousel>
</template>
