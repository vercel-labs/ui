<script lang="ts">
  import {
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  } from "@ui-sdk/svelte/scroll-area"

  const tags = Array.from({ length: 20 }, (_, index) => `v1.2.0-beta.${50 - index}`)
</script>

<div data-slot="row">
  {#each [0, 2000] as delay (delay)}
    <div data-slot="stack">
      <code>scrollHideDelay={delay}</code>
      <ScrollArea type="scroll" scrollHideDelay={delay}>
        <ScrollAreaViewport>
          <ScrollAreaContent>
            {#each tags as tag (tag)}
              <div>{tag}</div>
            {/each}
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar>
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
      </ScrollArea>
    </div>
  {/each}
</div>
