import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselViewport,
} from "@ui-sdk/solid/carousel"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"

const slides = ["One", "Two", "Three"]

function Fixture() {
  const [action, setAction] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <Carousel
        class="carousel"
        aria-label="Photos"
        onPageChange={(page) => setAction(String(page))}
      >
        <CarouselViewport class="carousel-viewport">
          <CarouselContent>
            <For each={slides}>
              {(slide) => (
                <CarouselItem
                  class={(state) =>
                    `carousel-slide ${state.active ? "is-active" : "is-inactive"}`
                  }
                >
                  {slide}
                </CarouselItem>
              )}
            </For>
          </CarouselContent>
        </CarouselViewport>
        <CarouselNext
          render={(props, state) => (
            <button {...props}>
              {state.disabled ? "No more photos" : "Next photo"}
            </button>
          )}
        />
        <CarouselIndicatorGroup aria-label="Choose a photo">
          <For each={slides}>
            {(_, index) => (
              <CarouselIndicator
                aria-label={`Photo ${index() + 1}`}
                render={(props) => (
                  <a {...props} href={`#photo-${index() + 1}`} />
                )}
              >
                {index() + 1}
              </CarouselIndicator>
            )}
          </For>
        </CarouselIndicatorGroup>
      </Carousel>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
