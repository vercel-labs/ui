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

  const photos = [
    { name: "Dunes" },
    { name: "Forest" },
    { name: "Glacier" },
    { name: "Canyon" },
    { name: "Meadow" },
    { name: "Harbor" },
  ]
</script>

<Carousel aria-label="Photos" align="center">
  <CarouselViewport>
    <CarouselContent>
      {#each photos as photo (photo.name)}
        <CarouselItem>
          <div data-slot="tile">
            {photo.name}
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
</Carousel>
