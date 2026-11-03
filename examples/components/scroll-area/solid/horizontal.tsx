import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/solid/scroll-area"
import { For } from "solid-js"

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
          <For each={artworks}>
            {(artwork) => (
              <figure>
                <div />
                <figcaption>{artwork.title}</figcaption>
              </figure>
            )}
          </For>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
  )
}

export { Example }
