import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
  type ScrollAreaType,
} from "@ui-sdk/solid/scroll-area"
import { For } from "solid-js"

const types: ScrollAreaType[] = ["hover", "scroll", "auto", "always"]

const tags = Array.from({ length: 20 }, (_, index) => `v1.2.0-beta.${50 - index}`)

function Example() {
  return (
    <div data-slot="grid">
      <For each={types}>
        {(type) => (
          <div data-slot="stack">
            <code>type="{type}"</code>
            <ScrollArea type={type}>
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
