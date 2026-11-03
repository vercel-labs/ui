<script lang="ts">
  import {
    createScrollAreaController,
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  } from "@ui-sdk/svelte/scroll-area"

  const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`)

  const controller = createScrollAreaController()
  let position = $state("At the start")
  const read = () =>
    (position = controller.isAtEnd() ? "At the end" : controller.isAtStart() ? "At the start" : "In between")
</script>

<div data-slot="stack">
  <ScrollArea {controller}>
    <ScrollAreaViewport onscroll={read}>
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
  <div data-slot="stack">
    <button data-variant="secondary"
      type="button"
      onclick={() => controller.scrollToStart({ behavior: "smooth" })}
    >
      Back to top
    </button>
    <button data-variant="secondary"
      type="button"
      onclick={() => controller.scrollToEnd({ behavior: "instant" })}
    >
      Jump to the end
    </button>
    <output data-slot="output">{position}</output>
  </div>
</div>
