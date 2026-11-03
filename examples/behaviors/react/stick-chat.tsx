import * as React from "react"
import { createStickToBottom, css, definePrimitive, type StickToBottomState } from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"

type ThreadState = StickToBottomState & { messages: string[]; older: number }

const thread = definePrimitive({
  name: "thread",
  state: (): ThreadState => ({
    messages: Array.from({ length: 12 }, (_, index) => `Message ${index + 1}`),
    older: 0,
    following: false,
    atBottom: false,
    unseen: false,
  }),
  api: (context) => {
    const { store } = context
    const stick = createStickToBottom({ initial: false, threshold: 48 })
    context.onDestroy(stick.subscribe(() => store.set(stick.get())))
    return {
      stick,
      act(action: string) {
        const { messages, older } = store.get()
        if (action === "send")
          store.set({ messages: [...messages, `Message ${messages.length + 1 - older}`] })
        else if (action === "older") {
          stick.prepend()
          store.set({
            older: older + 5,
            messages: [...Array.from({ length: 5 }, (_, index) => `Older ${older + 5 - index}`), ...messages],
          })
        } else if (action === "release") stick.release()
      },
    }
  },
  slots: (slot) => ({
    root: slot<{}, { messages: string[]; following: boolean; atBottom: boolean; unseen: boolean }>({
      state: (state) => ({
        messages: state.messages,
        following: state.following,
        atBottom: state.atBottom,
        unseen: state.unseen,
      }),
    }),
    log: slot({
      attrs: () => ({ role: "log", tabindex: "0", style: css({ overflow: "auto" }) }),
      bind: (el, { api }) => api.stick.connect(el),
    }),
    action: slot<{ value: string }>({
      props: { value: "string" },
      attrs: () => ({ type: "button" }),
      press: ({ api, key }) => api.act(key),
    }),
  }),
})

const parts = createParts(thread, { root: "div", log: "div", action: "button" })

const Thread = parts.Root

const ThreadLog = parts.Log

const ThreadAction = parts.Action

function Example() {
  return (
    <Thread>
      {({ messages, following, atBottom, unseen }) => (
        <>
          <ThreadLog aria-label="Thread">
            {messages.map((message) => (
              <div key={message} data-slot="stick-message">
                {message}
              </div>
            ))}
          </ThreadLog>
          <div data-slot="row">
            {[
              ["send", "Send"],
              ["older", "Load older"],
              ["release", "Let go"],
            ].map(([value, text]) => (
              <ThreadAction data-size="sm" key={value} value={value}>
                {text}
              </ThreadAction>
            ))}
          </div>
          <p data-log-state data-slot="output">
            {following ? "Following" : "Not following"}
            {atBottom ? ", at the end" : ""}
            {unseen ? ", new below" : ""}
          </p>
        </>
      )}
    </Thread>
  )
}

export { Example, thread, Thread, ThreadAction, ThreadLog, type ThreadState }
