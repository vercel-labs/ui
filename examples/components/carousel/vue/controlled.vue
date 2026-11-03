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

const page = ref(1)
const reason = ref("")
</script>

<template>
  <Carousel
    v-slot="{ state }"
    v-model:page="page"
    aria-label="Featured"
    @page-change="(_page: number, details: { reason: string }) => (reason = details.reason)"
  >
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
    <p data-slot="hint">
      Slide {{ state.page }} of {{ state.pageCount ?? slides.length }}{{ reason && ` · ${reason}` }}
    </p>
  </Carousel>
</template>
