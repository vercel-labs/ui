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

const slides = [1, 2, 3, 4, 5]
</script>

<template>
  <Carousel aria-label="Featured" loop>
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
      <CarouselNext data-variant="secondary" aria-label="Next slide">
        <ChevronRightIcon />
      </CarouselNext>
    </div>
  </Carousel>
</template>
