"use client"

import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/react/scroll-area"

const artworks = [
  { title: "Dunes at dusk" },
  { title: "Harbor fog" },
  { title: "Moss study" },
  { title: "Night market" },
  { title: "Salt flats" },
  { title: "Copper roofs" },
]

function Example() {
  return (
    <ScrollArea>
      <ScrollAreaViewport>
        <ScrollAreaContent>
          {artworks.map((artwork) => (
            <figure key={artwork.title}>
              <div />
              <figcaption>{artwork.title}</figcaption>
            </figure>
          ))}
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
  )
}

export { Example }
