<script lang="ts">
  import { ArrowDownIcon } from "@lucide/svelte"
  import {
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaScrollbar,
    ScrollAreaScrollToEnd,
    ScrollAreaThumb,
    ScrollAreaViewport,
  } from "@ui-sdk/svelte/scroll-area"
  import { onDestroy } from "svelte"

  type Message = { from: "user" | "assistant"; text: string }

  const conversation: Message[] = [
    { from: "user", text: "How do I keep a chat scrolled to the newest message?" },
    {
      from: "assistant",
      text: "Set stickToEnd on the scroll area. It stays at the bottom while messages and streamed words arrive.",
    },
    { from: "user", text: "And if I scroll up to read something?" },
    {
      from: "assistant",
      text: "It lets go as soon as you scroll toward the top, and follows again once you're back at the bottom.",
    },
  ]

  const reply =
    "Streaming answers grow one word at a time. Each word makes the content taller, and the scroll area keeps the last line in view, unless you've scrolled away to read. Images that load late count too, since the scroll area watches the size of its content rather than counting messages."

  let messages = $state(conversation)
  let streaming = $state(false)
  let timer: ReturnType<typeof setInterval> | undefined
  onDestroy(() => clearInterval(timer))

  function ask() {
    const words = reply.split(" ")
    streaming = true
    messages = [...messages, { from: "user", text: "Tell me more." }, { from: "assistant", text: "" }]
    let index = 0
    timer = setInterval(() => {
      const text = words.slice(0, ++index).join(" ")
      messages = [...messages.slice(0, -1), { from: "assistant", text }]
      if (index === words.length) {
        clearInterval(timer)
        streaming = false
      }
    }, 60)
  }
</script>

<div data-slot="stack">
  <ScrollArea stickToEnd>
    <ScrollAreaViewport role="log" aria-label="Conversation" aria-busy={streaming}>
      <ScrollAreaContent>
        {#each messages as message, index (index)}
          <p data-from={message.from}>
            {message.text || "…"}
          </p>
        {/each}
      </ScrollAreaContent>
    </ScrollAreaViewport>
    <ScrollAreaScrollbar>
      <ScrollAreaThumb />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollToEnd>
      <ArrowDownIcon />
      Jump to latest
    </ScrollAreaScrollToEnd>
  </ScrollArea>
  <button data-variant="secondary" type="button" disabled={streaming} onclick={ask}>
    {streaming ? "Answering…" : "Ask for more"}
  </button>
</div>
