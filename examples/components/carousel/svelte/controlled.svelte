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

  let page = $state(1)
  let reason = $state("")
</script>

<Carousel bind:page aria-label="Featured" onPageChange={(_page, details) => (reason = details.reason)}>
  {#snippet children(state)}
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
      <CarouselNext data-variant="secondary" aria-label="Next slide">
        <ChevronRightIcon />
      </CarouselNext>
    </div>
    <p data-slot="hint">
      Slide {state.page} of {state.pageCount ?? slides.length}{reason ? ` · ${reason}` : ""}
    </p>
  {/snippet}
</Carousel>
