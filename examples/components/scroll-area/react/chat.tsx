"use client"

import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaScrollToEnd,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/react/scroll-area"
import { ArrowDownIcon } from "lucide-react"
import * as React from "react"

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
  const [messages, setMessages] = React.useState(conversation)
  const [streaming, setStreaming] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setInterval>>(undefined)
  React.useEffect(() => () => clearInterval(timer.current), [])

  const ask = () => {
    const words = reply.split(" ")
    setStreaming(true)
    setMessages((current) => [
      ...current,
      { from: "user", text: "Tell me more." },
      { from: "assistant", text: "" },
    ])
    let index = 0
    timer.current = setInterval(() => {
      const text = words.slice(0, ++index).join(" ")
      setMessages((current) => [...current.slice(0, -1), { from: "assistant", text }])
      if (index === words.length) {
        clearInterval(timer.current)
        setStreaming(false)
      }
    }, 60)
  }

  return (
    <div data-slot="stack">
      <ScrollArea stickToEnd>
        <ScrollAreaViewport role="log" aria-label="Conversation" aria-busy={streaming}>
          <ScrollAreaContent>
            {messages.map((message, index) => (
              <p key={index} data-from={message.from}>
                {message.text || "…"}
              </p>
            ))}
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
      <button data-variant="secondary" type="button" disabled={streaming} onClick={ask}>
        {streaming ? "Answering…" : "Ask for more"}
      </button>
    </div>
  )
}

export { Example }
