<script lang="ts">
  import { paginationRange } from "@ui-sdk/svelte/pagination"

  let slide = $state(1)
  const items = $derived(paginationRange({ page: slide, pageCount: 20, siblings: 2, boundaries: 1 }))
</script>

<div data-slot="stack">
  <div data-slot="row" data-variant="dots" role="group" aria-label="Slides">
    {#each items as item (item)}
      {#if typeof item === "number"}
        <button
          type="button"
          aria-label={`Slide ${item}`}
          aria-current={item === slide ? "true" : undefined}
          onclick={() => (slide = item)}
        ></button>
      {:else}
        <span
          aria-hidden="true"
        ></span>
      {/if}
    {/each}
  </div>
  <output data-slot="output">Slide {slide} of 20</output>
</div>
