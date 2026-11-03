import { paginationRange } from "@ui-sdk/solid/pagination"
import { createSignal, For } from "solid-js"

function Example() {
  const [slide, setSlide] = createSignal(1)
  const items = () => paginationRange({ page: slide(), pageCount: 20, siblings: 2, boundaries: 1 })

  return (
    <div data-slot="stack">
      <div data-slot="row" data-variant="dots" role="group" aria-label="Slides">
        <For each={items()}>
          {(item) =>
            typeof item === "number" ? (
              <button
                type="button"
                aria-label={`Slide ${item}`}
                aria-current={item === slide() ? "true" : undefined}
                onClick={() => setSlide(item)}
              />
            ) : (
              <span aria-hidden="true" />
            )
          }
        </For>
      </div>
      <output data-slot="output">Slide {slide()} of 20</output>
    </div>
  )
}

export { Example }
