import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
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
    <div uiCarousel aria-label="Featured" [defaultPage]="3">
      <div data-slot="row">
        <button uiCarouselPrevious aria-label="Previous slide">
          <svg lucideChevronLeft></svg>
        </button>
        <div *uiCarouselViewport>
          <div *uiCarouselContent>
            @for (slide of slides; track slide) {
              <div uiCarouselItem>
                <div data-slot="tile">{{ slide }}</div>
              </div>
            }
          </div>
        </div>
        <button uiCarouselNext aria-label="Next slide">
          <svg lucideChevronRight></svg>
        </button>
      </div>
    </div>
  `,
})
class Example {
  readonly slides = [1, 2, 3, 4, 5]
}

export { Example }
