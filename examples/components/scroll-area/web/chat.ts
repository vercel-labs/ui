import "@ui-sdk/web/scroll-area"
import { ArrowDown, createElement } from "lucide"

const conversation = [
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

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-scroll-area stick-to-end>
        <ui-scroll-area-viewport role="log" aria-label="Conversation" aria-busy="false">
          <ui-scroll-area-content>
            ${conversation.map((message) => `<p data-from="${message.from}">${message.text}</p>`).join("")}
          </ui-scroll-area-content>
        </ui-scroll-area-viewport>
        <ui-scroll-area-scrollbar>
          <ui-scroll-area-thumb></ui-scroll-area-thumb>
        </ui-scroll-area-scrollbar>
        <ui-scroll-area-scroll-to-end>
          <button>
            ${createElement(ArrowDown, { "aria-hidden": "true" }).outerHTML}
            Jump to latest
          </button>
        </ui-scroll-area-scroll-to-end>
      </ui-scroll-area>
      <button data-variant="secondary" type="button" data-ask>Ask for more</button>
    </div>
  `
  const content = root.querySelector("ui-scroll-area-content")!
  const viewport = root.querySelector("ui-scroll-area-viewport")!
  const ask = root.querySelector<HTMLButtonElement>("[data-ask]")!
  ask.addEventListener("click", () => {
    const words = reply.split(" ")
    ask.disabled = true
    ask.textContent = "Answering…"
    viewport.setAttribute("aria-busy", "true")
    content.insertAdjacentHTML("beforeend", `<p>Tell me more.</p><p>…</p>`)
    const answer = content.lastElementChild!
    let index = 0
    const timer = setInterval(() => {
      answer.textContent = words.slice(0, ++index).join(" ")
      if (index < words.length && root.isConnected) {
        return
      }
      clearInterval(timer)
      ask.disabled = false
      ask.textContent = "Ask for more"
      viewport.setAttribute("aria-busy", "false")
    }, 60)
  })
}

export { mount }
