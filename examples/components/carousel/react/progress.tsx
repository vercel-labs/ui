"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/react/carousel"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import * as React from "react"

const slides = [1, 2, 3, 4, 5]

function Example() {
  const [rested, setRested] = React.useState(1)
  return (
    <Carousel aria-label="Featured" onPageChangeComplete={setRested}>
      <CarouselViewport>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide}>
              <div data-slot="tile">{slide}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <div data-slot="row">
        <CarouselPrevious data-variant="secondary" aria-label="Previous slide">
          <ChevronLeftIcon />
        </CarouselPrevious>
        <div data-slot="bar">
          <div />
        </div>
        <CarouselNext data-variant="secondary" aria-label="Next slide">
          <ChevronRightIcon />
        </CarouselNext>
      </div>
      <p data-slot="hint">Rested on slide {rested}</p>
    </Carousel>
  )
}

export { Example }
