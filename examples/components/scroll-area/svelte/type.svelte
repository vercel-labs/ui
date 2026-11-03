<script lang="ts">
  import {
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
    type ScrollAreaType,
  } from "@ui-sdk/svelte/scroll-area"

  const types: ScrollAreaType[] = ["hover", "scroll", "auto", "always"]

  const tags = Array.from({ length: 20 }, (_, index) => `v1.2.0-beta.${50 - index}`)
</script>

<div data-slot="grid">
  {#each types as type (type)}
    <div data-slot="stack">
      <code>type="{type}"</code>
      <ScrollArea {type}>
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
