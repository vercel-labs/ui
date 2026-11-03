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
import { ref } from "vue"

const slides = [1, 2, 3, 4, 5]

const rested = ref(1)
</script>

<template>
  <Carousel aria-label="Featured" @page-change-complete="(page: number) => (rested = page)">
    <CarouselViewport>
      <CarouselContent>
        <CarouselItem v-for="slide in slides" :key="slide">
          <div data-slot="tile">
            {{ slide }}
          </div>
        </CarouselItem>
      </CarouselContent>
    </CarouselViewport>
    <div data-slot="row">
      <CarouselPrevious data-variant="secondary" aria-label="Previous slide">
        <ChevronLeftIcon />
      </CarouselPrevious>
      <div data-slot="bar">
        <div />
      </div>
      <CarouselNext data-variant="secondary" aria-label="Next slide">
        <ChevronRightIcon />
      </CarouselNext>
    </div>
    <p data-slot="hint">Rested on slide {{ rested }}</p>
  </Carousel>
</template>
