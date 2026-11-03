import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaScrollToEnd,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/solid/scroll-area"
import { createSignal, For, onCleanup } from "solid-js"

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

function Example() {
  const [messages, setMessages] = createSignal(conversation)
  const [streaming, setStreaming] = createSignal(false)
  let timer: ReturnType<typeof setInterval> | undefined
  onCleanup(() => clearInterval(timer))

  const ask = () => {
    const words = reply.split(" ")
    setStreaming(true)
    setMessages((current) => [
      ...current,
      { from: "user", text: "Tell me more." },
      { from: "assistant", text: "" },
    ])
    let index = 0
    timer = setInterval(() => {
      const text = words.slice(0, ++index).join(" ")
      setMessages((current) => [...current.slice(0, -1), { from: "assistant", text }])
      if (index === words.length) {
        clearInterval(timer)
        setStreaming(false)
      }
    }, 60)
  }

  return (
    <div data-slot="stack">
      <ScrollArea stickToEnd>
        <ScrollAreaViewport role="log" aria-label="Conversation" aria-busy={streaming() ? "true" : "false"}>
          <ScrollAreaContent>
            <For each={messages()} keyed={false}>
              {(message) => <p data-from={message().from}>{message().text || "…"}</p>}
            </For>
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar>
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
        <ScrollAreaScrollToEnd>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
          Jump to latest
        </ScrollAreaScrollToEnd>
      </ScrollArea>
      <button data-variant="secondary" type="button" disabled={streaming()} onClick={ask}>
        {streaming() ? "Answering…" : "Ask for more"}
      </button>
    </div>
  )
}

export { Example }
