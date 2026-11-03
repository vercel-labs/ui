<script lang="ts">
  import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/svelte"
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselViewport,
  } from "@ui-sdk/svelte/carousel"

  const slides = [1, 2, 3, 4, 5]

  let rested = $state(1)
</script>

<Carousel aria-label="Featured" onPageChangeComplete={(page) => (rested = page)}>
  <CarouselViewport>
    <CarouselContent>
      {#each slides as slide (slide)}
        <CarouselItem>
          <div data-slot="tile">
            {slide}
          </div>
        </CarouselItem>
      {/each}
    </CarouselContent>
  </CarouselViewport>
  <div data-slot="row">
    <CarouselPrevious data-variant="secondary" aria-label="Previous slide">
      <ChevronLeftIcon />
    </CarouselPrevious>
    <div data-slot="bar">
      <div></div>
    </div>
    <CarouselNext data-variant="secondary" aria-label="Next slide">
      <ChevronRightIcon />
    </CarouselNext>
  </div>
  <p data-slot="hint">Rested on slide {rested}</p>
</Carousel>
