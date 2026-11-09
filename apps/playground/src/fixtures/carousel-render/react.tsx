import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselViewport,
} from "@ui-sdk/react/carousel"
import * as React from "react"
import { createRoot } from "react-dom/client"

const slides = ["One", "Two", "Three"]

function Fixture() {
  const [action, setAction] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <Carousel
        className="carousel"
        aria-label="Photos"
        onPageChange={(page) => setAction(String(page))}
      >
        <CarouselViewport className="carousel-viewport">
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem
                key={slide}
                className={(state) =>
                  `carousel-slide ${state.active ? "is-active" : "is-inactive"}`
                }
              >
                {slide}
              </CarouselItem>
            ))}
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
          {slides.map((slide, index) => (
            <CarouselIndicator
              key={slide}
              aria-label={`Photo ${index + 1}`}
              render={<a href={`#photo-${index + 1}`} />}
            >
              {index + 1}
            </CarouselIndicator>
          ))}
        </CarouselIndicatorGroup>
      </Carousel>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
