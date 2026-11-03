<script lang="ts">
  import {
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  } from "@ui-sdk/svelte/scroll-area"

  const artworks = [
    { title: "Dunes at dusk" },
    { title: "Harbor fog" },
    { title: "Moss study" },
    { title: "Night market" },
    { title: "Salt flats" },
    { title: "Copper roofs" },
  ]
</script>

<ScrollArea>
  <ScrollAreaViewport>
    <ScrollAreaContent>
      {#each artworks as artwork (artwork.title)}
        <figure>
          <div></div>
          <figcaption>{artwork.title}</figcaption>
        </figure>
      {/each}
    </ScrollAreaContent>
  </ScrollAreaViewport>
  <ScrollAreaScrollbar orientation="horizontal">
    <ScrollAreaThumb />
  </ScrollAreaScrollbar>
</ScrollArea>
