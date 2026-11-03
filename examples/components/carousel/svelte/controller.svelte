<script lang="ts">
  import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/svelte"
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselViewport,
    createCarouselController,
  } from "@ui-sdk/svelte/carousel"

  const slides = [1, 2, 3, 4, 5]

  const carousel = createCarouselController()
</script>

<div data-slot="stack">
  <div data-slot="row">
    <span>Featured</span>
    <div data-slot="row">
      <CarouselPrevious data-variant="secondary" controller={carousel} aria-label="Previous slide">
        <ChevronLeftIcon />
      </CarouselPrevious>
      <CarouselNext data-variant="secondary" controller={carousel} aria-label="Next slide">
        <ChevronRightIcon />
      </CarouselNext>
    </div>
  </div>
  <Carousel aria-label="Featured" controller={carousel} drag={false}>
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
  </Carousel>
  <button data-variant="secondary" type="button" onclick={() => carousel.setPage(5)}>
    Show the last slide
  </button>
</div>
