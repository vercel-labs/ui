<script lang="ts">
  import {
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaCorner,
    ScrollAreaScrollbar,
    ScrollAreaScrollToEnd,
    ScrollAreaThumb,
    ScrollAreaViewport,
  } from "@ui-sdk/svelte"
  import {
    scrollAreaFixture,
    scrollAreaOptions,
  } from "tests/fixtures/scroll-area.ts"

  const { tags, gallery, short, chat } = scrollAreaFixture
  const { native, ...options } = scrollAreaOptions()
  let messages = $state<{ text: string; image?: boolean }[]>(
    chat.messages.map((text) => ({ text }))
  )
  let imagesLoaded = $state(false)

  function addMessage(image = false) {
    messages = [...messages, { text: `Message ${messages.length + 1}`, image }]
  }

  function stream() {
    const last = messages[messages.length - 1]
    messages = [
      ...messages.slice(0, -1),
      { ...last, text: last.text + chat.streamed },
    ]
  }
</script>

<div class="fixture scroll-fixture">
  <button>Before</button>
  <ScrollArea class="scroll-area" {...options}>
    <ScrollAreaViewport
      class="scroll-area-viewport"
      role="region"
      aria-label={tags.label}
    >
      <ScrollAreaContent>
        {#each tags.items as item (item)}
          <p class="scroll-area-item">{item}</p>
        {/each}
      </ScrollAreaContent>
    </ScrollAreaViewport>
    {#if !native}
      <ScrollAreaScrollbar class="scroll-area-scrollbar">
        <ScrollAreaThumb class="scroll-area-thumb" />
      </ScrollAreaScrollbar>
    {/if}
  </ScrollArea>
  <ScrollArea class="scroll-area is-wide" {...options}>
    <ScrollAreaViewport
      class="scroll-area-viewport"
      role="region"
      aria-label={gallery.label}
    >
      <ScrollAreaContent class="scroll-area-grid">
        {#each gallery.items as item (item)}
          <a href={`#${item}`}>{item}</a>
        {/each}
      </ScrollAreaContent>
    </ScrollAreaViewport>
    <ScrollAreaScrollbar class="scroll-area-scrollbar">
      <ScrollAreaThumb class="scroll-area-thumb" />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollbar class="scroll-area-scrollbar" orientation="horizontal">
      <ScrollAreaThumb class="scroll-area-thumb" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner class="scroll-area-corner" />
  </ScrollArea>
  <ScrollArea class="scroll-area" {...options}>
    <ScrollAreaViewport
      class="scroll-area-viewport"
      role="region"
      aria-label={short.label}
    >
      <ScrollAreaContent>
        {#each short.items as item (item)}
          <p class="scroll-area-item">{item}</p>
        {/each}
      </ScrollAreaContent>
    </ScrollAreaViewport>
    <ScrollAreaScrollbar class="scroll-area-scrollbar">
      <ScrollAreaThumb class="scroll-area-thumb" />
    </ScrollAreaScrollbar>
  </ScrollArea>
  <ScrollArea class="scroll-area is-chat" stickToEnd {...options}>
    <ScrollAreaViewport
      class="scroll-area-viewport"
      role="region"
      aria-label={chat.label}
    >
      <ScrollAreaContent>
        {#each messages as message, index (index)}
          <p class="scroll-area-message">
            {message.text}
            {#if message.image}
              <span
                role="img"
                aria-label="Image"
                style="display:block;height:{imagesLoaded
                  ? `${chat.imageHeight}px`
                  : '0px'}"
              ></span>
            {/if}
          </p>
        {/each}
      </ScrollAreaContent>
    </ScrollAreaViewport>
    <ScrollAreaScrollbar class="scroll-area-scrollbar">
      <ScrollAreaThumb class="scroll-area-thumb" />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollToEnd class="scroll-area-end"
      >{chat.jump}</ScrollAreaScrollToEnd
    >
  </ScrollArea>
  <button onclick={() => addMessage()}>Add message</button>
  <button onclick={() => stream()}>Stream</button>
  <button onclick={() => addMessage(true)}>Add image</button>
  <button onclick={() => (imagesLoaded = true)}>Load images</button>
  <button>After</button>
  <output role="status" aria-label="Last action"></output>
  <div class="scroll-fixture-spacer"></div>
</div>
