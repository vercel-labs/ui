<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/vue"
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/vue/carousel"

const products = [1, 2, 3, 4, 5, 6, 7, 8]
</script>

<template>
  <Carousel aria-label="Products" :slides-per-page="3">
    <CarouselViewport>
      <CarouselContent>
        <CarouselItem v-for="product in products" :key="product">
          <div data-slot="tile">
            {{ product }}
          </div>
        </CarouselItem>
      </CarouselContent>
    </CarouselViewport>
    <div data-slot="row">
      <CarouselPrevious data-variant="secondary" aria-label="Previous page">
        <ChevronLeftIcon />
      </CarouselPrevious>
      <CarouselIndicatorGroup v-slot="{ state }" aria-label="Choose a page">
        <CarouselIndicator
          v-for="index in state.pageCount ?? 3"
          :key="index"
          :page="index"
          :aria-label="`Page ${index}`"
        />
      </CarouselIndicatorGroup>
      <CarouselNext data-variant="secondary" aria-label="Next page">
        <ChevronRightIcon />
      </CarouselNext>
    </div>
  </Carousel>
</template>
