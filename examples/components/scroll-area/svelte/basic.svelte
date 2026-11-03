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
  <ScrollAreaViewport>
    <ScrollAreaContent>
      <h4>Tags</h4>
      {#each tags as tag (tag)}
        <div>
          {tag}
        </div>
      {/each}
    </ScrollAreaContent>
  </ScrollAreaViewport>
  <ScrollAreaScrollbar>
    <ScrollAreaThumb />
  </ScrollAreaScrollbar>
</ScrollArea>
