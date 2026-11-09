<script lang="ts">
  import {
    Carousel,
    CarouselContent,
    CarouselIndicator,
    CarouselIndicatorGroup,
    CarouselItem,
    CarouselNext,
    CarouselViewport,
  } from "@ui-sdk/svelte"

  const slides = ["One", "Two", "Three"]
  let action = $state("")
</script>

<div class="fixture">
  <button>Before</button>
  <Carousel
    class="carousel"
    aria-label="Photos"
    onPageChange={(page) => (action = String(page))}
  >
    <CarouselViewport class="carousel-viewport">
      <CarouselContent>
        {#each slides as slide (slide)}
          <CarouselItem class="carousel-slide">
            {#snippet children(state)}
              <span class={state.active ? "is-active" : "is-inactive"}
                >{slide}</span
              >
            {/snippet}
          </CarouselItem>
        {/each}
      </CarouselContent>
    </CarouselViewport>
    <CarouselNext>
      {#snippet render({ props, state })}
        <button {...props}
          >{state.disabled ? "No more photos" : "Next photo"}</button
        >
      {/snippet}
    </CarouselNext>
    <CarouselIndicatorGroup aria-label="Choose a photo">
      {#each slides as slide, index (slide)}
        <CarouselIndicator
          href={`#photo-${index + 1}`}
          aria-label={`Photo ${index + 1}`}
        >
          {#snippet render({ props })}
            <a {...props}>
              {index + 1}
            </a>
          {/snippet}
        </CarouselIndicator>
      {/each}
    </CarouselIndicatorGroup>
  </Carousel>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
