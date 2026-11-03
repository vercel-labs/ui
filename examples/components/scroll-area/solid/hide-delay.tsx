import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/solid/scroll-area"
import { For } from "solid-js"

const tags = Array.from({ length: 20 }, (_, index) => `v1.2.0-beta.${50 - index}`)

function Example() {
  return (
    <div data-slot="row">
      <For each={[0, 2000]}>
        {(delay) => (
          <div data-slot="stack">
            <code>scrollHideDelay={delay}</code>
            <ScrollArea type="scroll" scrollHideDelay={delay}>
              <ScrollAreaViewport>
                <ScrollAreaContent>
                  <For each={tags}>{(tag) => <div>{tag}</div>}</For>
                </ScrollAreaContent>
              </ScrollAreaViewport>
              <ScrollAreaScrollbar>
                <ScrollAreaThumb />
              </ScrollAreaScrollbar>
            </ScrollArea>
          </div>
        )}
      </For>
    </div>
  )
}

export { Example }
