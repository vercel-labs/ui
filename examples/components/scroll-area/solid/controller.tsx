import {
  createScrollAreaController,
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/solid/scroll-area"
import { createSignal, For } from "solid-js"

const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`)

function Example() {
  const controller = createScrollAreaController()
  const [position, setPosition] = createSignal("At the start")
  const read = () =>
    setPosition(controller.isAtEnd() ? "At the end" : controller.isAtStart() ? "At the start" : "In between")
  return (
    <div data-slot="stack">
      <ScrollArea controller={controller}>
        <ScrollAreaViewport onScroll={read}>
          <ScrollAreaContent>
            <For each={tags}>{(tag) => <div>{tag}</div>}</For>
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar>
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
      </ScrollArea>
      <div data-slot="stack">
        <button
          data-variant="secondary"
          type="button"
          onClick={() => controller.scrollToStart({ behavior: "smooth" })}
        >
          Back to top
        </button>
        <button
          data-variant="secondary"
          type="button"
          onClick={() => controller.scrollToEnd({ behavior: "instant" })}
        >
          Jump to the end
        </button>
        <output data-slot="output">{position()}</output>
      </div>
    </div>
  )
}

export { Example }
