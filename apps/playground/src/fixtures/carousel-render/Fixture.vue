<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselViewport,
} from "@ui-sdk/vue"
import { ref } from "vue"

const slides = ["One", "Two", "Three"]
const action = ref("")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Carousel
      class="carousel"
      aria-label="Photos"
      @page-change="(page: number) => (action = String(page))"
    >
      <CarouselViewport class="carousel-viewport">
        <CarouselContent>
          <CarouselItem
            v-for="slide in slides"
            :key="slide"
            v-slot="{ state }"
            class="carousel-slide"
          >
            <span :class="state.active ? 'is-active' : 'is-inactive'">{{
              slide
            }}</span>
          </CarouselItem>
        </CarouselContent>
      </CarouselViewport>
      <CarouselNext>
        <template #render="{ props, state }">
          <button v-bind="props">
            {{ state.disabled ? "No more photos" : "Next photo" }}
          </button>
        </template>
      </CarouselNext>
      <CarouselIndicatorGroup aria-label="Choose a photo">
        <CarouselIndicator
          v-for="(slide, index) in slides"
          :key="slide"
          :href="`#photo-${index + 1}`"
          :aria-label="`Photo ${index + 1}`"
        >
          <template #render="{ props }">
            <a v-bind="props">
              {{ index + 1 }}
            </a>
          </template>
        </CarouselIndicator>
      </CarouselIndicatorGroup>
    </Carousel>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
