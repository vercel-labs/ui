"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
  createCarouselController,
} from "@ui-sdk/react/carousel"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useState } from "react"

const slides = [1, 2, 3, 4, 5]

function Example() {
  const [carousel] = useState(createCarouselController)
  return (
    <div data-slot="stack">
      <div data-slot="row">
        <span>Featured</span>
        <div data-slot="row">
          <CarouselPrevious data-variant="secondary" controller={carousel} aria-label="Previous slide">
            <ChevronLeftIcon />
          </CarouselPrevious>
          <CarouselNext data-variant="secondary" controller={carousel} aria-label="Next slide">
            <ChevronRightIcon />
          </CarouselNext>
        </div>
      </div>
      <Carousel aria-label="Featured" controller={carousel} drag={false}>
        <CarouselViewport>
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide}>
                <div data-slot="tile">{slide}</div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </CarouselViewport>
      </Carousel>
      <button data-variant="secondary" type="button" onClick={() => carousel.setPage(5)}>
        Show the last slide
      </button>
    </div>
  )
}

export { Example }
