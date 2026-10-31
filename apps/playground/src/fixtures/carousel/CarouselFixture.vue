<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPlayToggle,
  CarouselPrevious,
  CarouselViewport,
  createCarouselController,
} from "@ui-sdk/vue"
import { carouselFixture, carouselOptions } from "tests/fixtures/carousel.ts"
import { ref } from "vue"

const controller = createCarouselController()
const { perView, cancel, playToggle, controlled, options } = carouselOptions()
const page = ref(1)

const action = ref("")
const reason = ref("")
const rested = ref("")

function onPageChange(next: number, details: { reason: string; cancel: () => void }) {
  if (next === cancel) return details.cancel()
  if (controlled) page.value = next
  action.value = String(next)
  reason.value = details.reason
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Carousel
      class="carousel"
      :aria-label="carouselFixture.label"
      :style="{ '--per-view': perView }"
      v-bind="controlled ? { ...options, page } : options"
      :controller="controller"
      @page-change="onPageChange"
      @page-change-complete="(page: number) => (rested = String(page))"
    >
      <CarouselPlayToggle v-if="playToggle" class="carousel-toggle" v-slot="{ state }">
        {{ state.playing ? carouselFixture.stop : carouselFixture.start }}
      </CarouselPlayToggle>
      <CarouselViewport class="carousel-viewport">
        <CarouselContent class="carousel-content">
          <CarouselItem
            v-for="(slide, index) in carouselFixture.slides"
            :key="slide.title"
            class="carousel-slide"
          >
            <p>{{ slide.title }}</p>
            <a :href="`?product=${index + 1}`">{{ slide.link }}</a>
            <label v-if="index === 2"> {{ carouselFixture.field }} <input /></label>
          </CarouselItem>
        </CarouselContent>
      </CarouselViewport>
      <div class="carousel-controls">
        <CarouselPrevious class="carousel-step">{{ carouselFixture.previous }}</CarouselPrevious>
        <CarouselNext class="carousel-step">{{ carouselFixture.next }}</CarouselNext>
      </div>
      <CarouselIndicatorGroup class="carousel-controls" :aria-label="carouselFixture.indicators">
        <CarouselIndicator
          v-for="(slide, index) in carouselFixture.slides"
          :key="slide.title"
          class="carousel-indicator"
          :aria-label="carouselFixture.indicator(index + 1)"
        >
          {{ index + 1 }}
        </CarouselIndicator>
      </CarouselIndicatorGroup>
    </Carousel>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output aria-label="Last reason">{{ reason }}</output>
    <output aria-label="Rested on">{{ rested }}</output>
    <button @click="controller.setPage(4)">Show page 4</button>
    <button v-if="controlled" @click="page = 3">Show page 3 by prop</button>
    <CarouselNext :controller="controller">Next from outside</CarouselNext>
  </div>
</template>
