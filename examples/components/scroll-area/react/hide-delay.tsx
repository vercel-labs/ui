"use client"

import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/react/scroll-area"

const tags = Array.from({ length: 20 }, (_, index) => `v1.2.0-beta.${50 - index}`)

function Example() {
  return (
    <div data-slot="row">
      {[0, 2000].map((delay) => (
        <div data-slot="stack" key={delay}>
          <code>scrollHideDelay={delay}</code>
          <ScrollArea type="scroll" scrollHideDelay={delay}>
            <ScrollAreaViewport>
              <ScrollAreaContent>
                {tags.map((tag) => (
                  <div key={tag}>{tag}</div>
                ))}
              </ScrollAreaContent>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar>
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
          </ScrollArea>
        </div>
      ))}
    </div>
  )
}

export { Example }
