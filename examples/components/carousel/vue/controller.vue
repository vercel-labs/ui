<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/vue"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
  createCarouselController,
} from "@ui-sdk/vue/carousel"

const slides = [1, 2, 3, 4, 5]

const carousel = createCarouselController()
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <span>Featured</span>
      <div data-slot="row">
        <CarouselPrevious data-variant="secondary" :controller="carousel" aria-label="Previous slide">
          <ChevronLeftIcon />
        </CarouselPrevious>
        <CarouselNext data-variant="secondary" :controller="carousel" aria-label="Next slide">
          <ChevronRightIcon />
        </CarouselNext>
      </div>
    </div>
    <Carousel aria-label="Featured" :controller="carousel" :drag="false">
      <CarouselViewport>
        <CarouselContent>
          <CarouselItem v-for="slide in slides" :key="slide">
            <div data-slot="tile">
              {{ slide }}
            </div>
          </CarouselItem>
        </CarouselContent>
      </CarouselViewport>
    </Carousel>
    <button data-variant="secondary" type="button" @click="carousel.setPage(5)">Show the last slide</button>
  </div>
</template>
