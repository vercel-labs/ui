import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaScrollToEnd,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/react/scroll-area"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  scrollAreaFixture,
  scrollAreaOptions,
} from "tests/fixtures/scroll-area.ts"

const { tags, gallery, short, chat } = scrollAreaFixture

function Scrollbar({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal"
}) {
  return (
    <ScrollAreaScrollbar
      className="scroll-area-scrollbar"
      orientation={orientation}
    >
      <ScrollAreaThumb className="scroll-area-thumb" />
    </ScrollAreaScrollbar>
  )
}

type Message = { text: string; image?: boolean }

function Fixture() {
  const { native, ...options } = scrollAreaOptions()
  const [messages, setMessages] = React.useState<Message[]>(
    chat.messages.map((text) => ({ text }))
  )
  const [imagesLoaded, setImagesLoaded] = React.useState(false)
  return (
    <div className="fixture scroll-fixture">
      <button>Before</button>
      <ScrollArea className="scroll-area" {...options}>
        <ScrollAreaViewport
          className="scroll-area-viewport"
          role="region"
          aria-label={tags.label}
        >
          <ScrollAreaContent>
            {tags.items.map((item) => (
              <p key={item} className="scroll-area-item">
                {item}
              </p>
            ))}
          </ScrollAreaContent>
        </ScrollAreaViewport>
        {!native && <Scrollbar />}
      </ScrollArea>
      <ScrollArea className="scroll-area is-wide" {...options}>
        <ScrollAreaViewport
          className="scroll-area-viewport"
          role="region"
          aria-label={gallery.label}
        >
          <ScrollAreaContent className="scroll-area-grid">
            {gallery.items.map((item) => (
              <a key={item} href={`#${item}`}>
                {item}
              </a>
            ))}
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <Scrollbar />
        <Scrollbar orientation="horizontal" />
        <ScrollAreaCorner className="scroll-area-corner" />
      </ScrollArea>
      <ScrollArea className="scroll-area" {...options}>
        <ScrollAreaViewport
          className="scroll-area-viewport"
          role="region"
          aria-label={short.label}
        >
          <ScrollAreaContent>
            {short.items.map((item) => (
              <p key={item} className="scroll-area-item">
                {item}
              </p>
            ))}
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <Scrollbar />
      </ScrollArea>
      <ScrollArea className="scroll-area is-chat" stickToEnd {...options}>
        <ScrollAreaViewport
          className="scroll-area-viewport"
          role="region"
          aria-label={chat.label}
        >
          <ScrollAreaContent>
            {messages.map((message, index) => (
              <p key={index} className="scroll-area-message">
                {message.text}
                {message.image && (
                  <span
                    role="img"
                    aria-label="Image"
                    style={{
                      display: "block",
                      height: imagesLoaded ? chat.imageHeight : 0,
                    }}
                  />
                )}
              </p>
            ))}
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <Scrollbar />
        <ScrollAreaScrollToEnd className="scroll-area-end">
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
      <div className="scroll-fixture-spacer" />
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
