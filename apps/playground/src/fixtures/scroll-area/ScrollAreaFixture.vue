<script setup lang="ts">
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaScrollToEnd,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/vue"
import {
  scrollAreaFixture,
  scrollAreaOptions,
} from "tests/fixtures/scroll-area.ts"
import { ref } from "vue"

const { tags, gallery, short, chat } = scrollAreaFixture
const { native, ...options } = scrollAreaOptions()
const messages = ref<{ text: string; image?: boolean }[]>(
  chat.messages.map((text) => ({ text }))
)
const imagesLoaded = ref(false)

function addMessage(image = false) {
  messages.value = [
    ...messages.value,
    { text: `Message ${messages.value.length + 1}`, image },
  ]
}

function stream() {
  const last = messages.value[messages.value.length - 1]
  messages.value = [
    ...messages.value.slice(0, -1),
    { ...last, text: last.text + chat.streamed },
  ]
}
</script>

<template>
  <div class="fixture scroll-fixture">
    <button>Before</button>
    <ScrollArea class="scroll-area" v-bind="options">
      <ScrollAreaViewport
        class="scroll-area-viewport"
        role="region"
        :aria-label="tags.label"
      >
        <ScrollAreaContent>
          <p v-for="item in tags.items" :key="item" class="scroll-area-item">
            {{ item }}
          </p>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar v-if="!native" class="scroll-area-scrollbar">
        <ScrollAreaThumb class="scroll-area-thumb" />
      </ScrollAreaScrollbar>
    </ScrollArea>
    <ScrollArea class="scroll-area is-wide" v-bind="options">
      <ScrollAreaViewport
        class="scroll-area-viewport"
        role="region"
        :aria-label="gallery.label"
      >
        <ScrollAreaContent class="scroll-area-grid">
          <a v-for="item in gallery.items" :key="item" :href="`#${item}`">{{
            item
          }}</a>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar class="scroll-area-scrollbar">
        <ScrollAreaThumb class="scroll-area-thumb" />
      </ScrollAreaScrollbar>
      <ScrollAreaScrollbar
        class="scroll-area-scrollbar"
        orientation="horizontal"
      >
        <ScrollAreaThumb class="scroll-area-thumb" />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner class="scroll-area-corner" />
    </ScrollArea>
    <ScrollArea class="scroll-area" v-bind="options">
      <ScrollAreaViewport
        class="scroll-area-viewport"
        role="region"
        :aria-label="short.label"
      >
        <ScrollAreaContent>
          <p v-for="item in short.items" :key="item" class="scroll-area-item">
            {{ item }}
          </p>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar class="scroll-area-scrollbar">
        <ScrollAreaThumb class="scroll-area-thumb" />
      </ScrollAreaScrollbar>
    </ScrollArea>
    <ScrollArea class="scroll-area is-chat" stick-to-end v-bind="options">
      <ScrollAreaViewport
        class="scroll-area-viewport"
        role="region"
        :aria-label="chat.label"
      >
        <ScrollAreaContent>
          <p
            v-for="(message, index) in messages"
            :key="index"
            class="scroll-area-message"
          >
            {{ message.text }}
            <span
              v-if="message.image"
              role="img"
              aria-label="Image"
              :style="{
                display: 'block',
                height: imagesLoaded ? `${chat.imageHeight}px` : '0px',
              }"
            />
          </p>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar class="scroll-area-scrollbar">
        <ScrollAreaThumb class="scroll-area-thumb" />
      </ScrollAreaScrollbar>
      <ScrollAreaScrollToEnd class="scroll-area-end">{{
        chat.jump
      }}</ScrollAreaScrollToEnd>
    </ScrollArea>
    <button @click="addMessage()">Add message</button>
    <button @click="stream()">Stream</button>
    <button @click="addMessage(true)">Add image</button>
    <button @click="imagesLoaded = true">Load images</button>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
    <div class="scroll-fixture-spacer"></div>
  </div>
</template>
