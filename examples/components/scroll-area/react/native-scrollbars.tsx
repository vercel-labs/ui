"use client"

import { ScrollArea, ScrollAreaContent, ScrollAreaViewport } from "@ui-sdk/react/scroll-area"

const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`)

function Example() {
  return (
    <ScrollArea>
      <ScrollAreaViewport>
        <ScrollAreaContent>
          {tags.map((tag) => (
            <div key={tag}>{tag}</div>
          ))}
        </ScrollAreaContent>
      </ScrollAreaViewport>
    </ScrollArea>
  )
}

export { Example }
