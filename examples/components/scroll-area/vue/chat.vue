<script setup lang="ts">
import { ArrowDownIcon } from "@lucide/vue"
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaScrollToEnd,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/vue/scroll-area"
import { onBeforeUnmount, ref } from "vue"

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

const messages = ref(conversation)
const streaming = ref(false)
let timer: ReturnType<typeof setInterval> | undefined
onBeforeUnmount(() => clearInterval(timer))

function ask() {
  const words = reply.split(" ")
  streaming.value = true
  messages.value = [
    ...messages.value,
    { from: "user", text: "Tell me more." },
    { from: "assistant", text: "" },
  ]
  let index = 0
  timer = setInterval(() => {
    const text = words.slice(0, ++index).join(" ")
    messages.value = [...messages.value.slice(0, -1), { from: "assistant", text }]
    if (index === words.length) {
      clearInterval(timer)
      streaming.value = false
    }
  }, 60)
}
</script>

<template>
  <div data-slot="stack">
    <ScrollArea stick-to-end>
      <ScrollAreaViewport role="log" aria-label="Conversation" :aria-busy="streaming">
        <ScrollAreaContent>
          <p v-for="(message, index) in messages" :key="index" :data-from="message.from">
            {{ message.text || "…" }}
          </p>
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
    <button data-variant="secondary" type="button" :disabled="streaming" @click="ask">
      {{ streaming ? "Answering…" : "Ask for more" }}
    </button>
  </div>
</template>
