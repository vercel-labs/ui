<script lang="ts">
  import {
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  } from "@ui-sdk/svelte"
  import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

  // A scroll area of N items for the counts specs, with its
  // scrollbar always shown. The content, the thumb and every item count their
  // renders. An update is the part's props changing, which each count reads so
  // it counts them. Items render in the content's snippet, so they count each
  // time it renders.
  const items = perfItems(perfSize())
  const count = (kind: "item" | "content" | "thumb", ...reads: unknown[]) => (
    countRender(kind),
    ""
  )
</script>

<div class="fixture scroll-fixture">
  <button>Before</button>
  <ScrollArea class="scroll-area" type="always">
    <ScrollAreaViewport
      class="scroll-area-viewport"
      role="region"
      aria-label="Items"
    >
      <ScrollAreaContent>
        {#snippet render({ props })}
          <div {...props}>
            {count("content", props)}
            {#each items as item (item.value)}
              <p class="scroll-area-item">{count("item", props)}{item.label}</p>
            {/each}
          </div>
        {/snippet}
      </ScrollAreaContent>
    </ScrollAreaViewport>
    <ScrollAreaScrollbar class="scroll-area-scrollbar">
      <ScrollAreaThumb class="scroll-area-thumb">
        {#snippet render({ props })}
          <div {...props}>{count("thumb", props)}</div>
        {/snippet}
      </ScrollAreaThumb>
    </ScrollAreaScrollbar>
  </ScrollArea>
  <button>After</button>
</div>
