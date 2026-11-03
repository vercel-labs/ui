<script lang="ts">
  import {
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  } from "@ui-sdk/svelte/scroll-area"

  const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`)
</script>

<ScrollArea>
  {#snippet render({ props, state })}
    <section {...props}>
      <ScrollAreaViewport aria-label="Releases">
        {#snippet render({ props })}
          <article {...props}>
            <ScrollAreaContent>
              {#each tags as tag (tag)}
                <p>{tag}</p>
              {/each}
            </ScrollAreaContent>
          </article>
        {/snippet}
      </ScrollAreaViewport>
      <p data-slot="hint" aria-hidden="true">
        {state.atStart ? "Scroll for older releases" : "Keep going"}
      </p>
      <ScrollAreaScrollbar>
        {#snippet render({ props })}
          <div data-slot="row" {...props}>
            <ScrollAreaThumb>
              {#snippet render({ props: thumbProps })}
                <div
                  {...thumbProps}
                ></div>
              {/snippet}
            </ScrollAreaThumb>
          </div>
        {/snippet}
      </ScrollAreaScrollbar>
    </section>
  {/snippet}
</ScrollArea>
