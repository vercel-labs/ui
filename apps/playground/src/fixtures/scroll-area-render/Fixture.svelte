<script lang="ts">
  import {
    ScrollArea,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  } from "@ui-sdk/svelte"

  const notes = Array.from({ length: 40 }, (_, index) => `Note ${index + 1}`)
  const renders = ((
    window as unknown as { renders: { root: number } }
  ).renders = { root: 0 })

  // Counts the root's snippet renders, which only an edge flipping should cause.
  function status(atEnd: boolean) {
    renders.root++
    return atEnd ? "At end" : "Reading"
  }
</script>

<div class="fixture">
  <button>Before</button>
  <ScrollArea class="scroll-area">
    {#snippet render({ props, state })}
      <section {...props}>
        <p class="render-status">{status(state.atEnd)}</p>
        <ScrollAreaViewport
          class="scroll-area-viewport"
          role="region"
          aria-label="Notes"
        >
          {#snippet render({ props })}
            <article {...props}>
              {#each notes as note (note)}
                <p class="scroll-area-item">{note}</p>
              {/each}
            </article>
          {/snippet}
        </ScrollAreaViewport>
        <ScrollAreaScrollbar class="scroll-area-scrollbar">
          <ScrollAreaThumb class="scroll-area-thumb" />
        </ScrollAreaScrollbar>
      </section>
    {/snippet}
  </ScrollArea>
  <button>After</button>
  <output role="status" aria-label="Last action"></output>
</div>
