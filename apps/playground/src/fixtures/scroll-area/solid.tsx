import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaScrollToEnd,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/solid/scroll-area"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  scrollAreaFixture,
  scrollAreaOptions,
} from "tests/fixtures/scroll-area.ts"

const { tags, gallery, short, chat } = scrollAreaFixture

function Scrollbar(props: { orientation?: "vertical" | "horizontal" }) {
  return (
    <ScrollAreaScrollbar
      class="scroll-area-scrollbar"
      orientation={props.orientation ?? "vertical"}
    >
      <ScrollAreaThumb class="scroll-area-thumb" />
    </ScrollAreaScrollbar>
  )
}

type Message = { text: string; image?: boolean }

function Fixture() {
  const { native, ...options } = scrollAreaOptions()
  const [messages, setMessages] = createSignal<Message[]>(
    chat.messages.map((text) => ({ text }))
  )
  const [imagesLoaded, setImagesLoaded] = createSignal(false)
  return (
    <div class="fixture scroll-fixture">
      <button>Before</button>
      <ScrollArea class="scroll-area" {...options}>
        <ScrollAreaViewport
          class="scroll-area-viewport"
          role="region"
          aria-label={tags.label}
        >
          <ScrollAreaContent>
            <For each={tags.items}>
              {(item) => <p class="scroll-area-item">{item}</p>}
            </For>
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <Show when={!native}>
          <Scrollbar />
        </Show>
      </ScrollArea>
      <ScrollArea class="scroll-area is-wide" {...options}>
        <ScrollAreaViewport
          class="scroll-area-viewport"
          role="region"
          aria-label={gallery.label}
        >
          <ScrollAreaContent class="scroll-area-grid">
            <For each={gallery.items}>
              {(item) => <a href={`#${item}`}>{item}</a>}
            </For>
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <Scrollbar />
        <Scrollbar orientation="horizontal" />
        <ScrollAreaCorner class="scroll-area-corner" />
      </ScrollArea>
      <ScrollArea class="scroll-area" {...options}>
        <ScrollAreaViewport
          class="scroll-area-viewport"
          role="region"
          aria-label={short.label}
        >
          <ScrollAreaContent>
            <For each={short.items}>
              {(item) => <p class="scroll-area-item">{item}</p>}
            </For>
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <Scrollbar />
      </ScrollArea>
      <ScrollArea class="scroll-area is-chat" stickToEnd {...options}>
        <ScrollAreaViewport
          class="scroll-area-viewport"
          role="region"
          aria-label={chat.label}
        >
          <ScrollAreaContent>
            <For each={messages()}>
              {(message) => (
                <p class="scroll-area-message">
                  {message.text}
                  <Show when={message.image}>
                    <span
                      role="img"
                      aria-label="Image"
                      style={{
                        display: "block",
                        height: `${imagesLoaded() ? chat.imageHeight : 0}px`,
                      }}
                    />
                  </Show>
                </p>
              )}
            </For>
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <Scrollbar />
        <ScrollAreaScrollToEnd class="scroll-area-end">
          {chat.jump}
        </ScrollAreaScrollToEnd>
      </ScrollArea>
      <button
        onClick={() =>
          setMessages((current) => [
            ...current,
            { text: `Message ${current.length + 1}` },
          ])
        }
      >
        Add message
      </button>
      <button
        onClick={() =>
          setMessages((current) => [
            ...current.slice(0, -1),
            {
              ...current[current.length - 1],
              text: current[current.length - 1].text + chat.streamed,
            },
          ])
        }
      >
        Stream
      </button>
      <button
        onClick={() =>
          setMessages((current) => [
            ...current,
            { text: `Message ${current.length + 1}`, image: true },
          ])
        }
      >
        Add image
      </button>
      <button onClick={() => setImagesLoaded(true)}>Load images</button>
      <button>After</button>
      <output role="status" aria-label="Last action" />
      <div class="scroll-fixture-spacer" />
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
