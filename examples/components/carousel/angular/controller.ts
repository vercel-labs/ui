import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
  createCarouselController,
} from "@ui-sdk/angular/carousel"

@Component({
  imports: [
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselViewport,
    LucideChevronLeft,
    LucideChevronRight,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          uiCarouselPrevious
          [controller]="carousel"
          aria-label="Previous slide"
        >
          <svg lucideChevronLeft></svg>
        </button>
        <button uiCarouselNext [controller]="carousel" aria-label="Next slide">
          <svg lucideChevronRight></svg>
        </button>
        <button type="button" (click)="carousel.setPage(5)">
          Show the Last Slide
        </button>
      </div>
      <div
        uiCarousel
        aria-label="Featured"
        [controller]="carousel"
        [drag]="false"
      >
        <div *uiCarouselViewport>
          <div *uiCarouselContent>
            @for (slide of slides; track slide) {
              <div uiCarouselItem>
                <div data-slot="tile">{{ slide }}</div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly slides = [1, 2, 3, 4, 5]

  readonly carousel = createCarouselController()
}

export { Example }
