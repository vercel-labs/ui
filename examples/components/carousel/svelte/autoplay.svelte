<script lang="ts">
  import { PauseIcon, PlayIcon } from "@lucide/svelte"
  import {
    Carousel,
    CarouselContent,
    CarouselIndicator,
    CarouselIndicatorGroup,
    CarouselItem,
    CarouselPlayToggle,
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

  let log = $state("")
</script>

<Carousel
  aria-label="Photos"
  defaultPlaying
  interval={4000}
  onPlayingChange={(playing, details) => (log = `${playing ? "Playing" : "Stopped"} (${details.reason})`)}
>
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
    <CarouselPlayToggle data-variant="secondary">
      {#snippet children(state)}
        {#if state.playing}
          <PauseIcon />
          <span data-slot="visually-hidden">Stop slide rotation</span>
        {:else}
          <PlayIcon />
          <span data-slot="visually-hidden">Start slide rotation</span>
        {/if}
      {/snippet}
    </CarouselPlayToggle>
    <CarouselIndicatorGroup aria-label="Choose a photo">
      {#each photos as photo, index (photo.name)}
        <CarouselIndicator page={index + 1} aria-label={photo.name}>
          <span
          ></span>
        </CarouselIndicator>
      {/each}
    </CarouselIndicatorGroup>
  </div>
  <p data-slot="hint"
    aria-live="polite"
  >{log}</p>
</Carousel>
