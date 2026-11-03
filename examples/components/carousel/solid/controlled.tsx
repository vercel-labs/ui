import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/solid/carousel"
import { createSignal, For } from "solid-js"

const slides = [1, 2, 3, 4, 5]

function Example() {
  const [page, setPage] = createSignal(1)
  const [reason, setReason] = createSignal("")
  return (
    <Carousel
      aria-label="Featured"
      page={page()}
      onPageChange={(next, details) => {
        setPage(next)
        setReason(details.reason)
      }}
    >
      {(state) => (
        <>
          <CarouselViewport>
            <CarouselContent>
              <For each={slides}>
                {(slide) => (
                  <CarouselItem>
                    <div data-slot="tile">{slide}</div>
                  </CarouselItem>
                )}
              </For>
            </CarouselContent>
          </CarouselViewport>
          <div data-slot="row">
            <CarouselPrevious data-variant="secondary" aria-label="Previous slide">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </CarouselPrevious>
            <CarouselNext data-variant="secondary" aria-label="Next slide">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </CarouselNext>
          </div>
          <p data-slot="hint">
            Slide {state.page} of {state.pageCount ?? slides.length}
            {reason() ? ` · ${reason()}` : ""}
          </p>
        </>
      )}
    </Carousel>
  )
}

export { Example }
