import { Component } from "@angular/core"
import { LucideChevronDown, LucideChevronUp } from "@lucide/angular"
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
    LucideChevronDown,
    LucideChevronUp,
  ],
  template: `
    <div uiCarousel aria-label="Featured" orientation="vertical">
      <div *uiCarouselViewport>
        <div *uiCarouselContent>
          @for (slide of slides; track slide) {
            <div uiCarouselItem>
              <div data-slot="tile">
                {{ slide }}
              </div>
            </div>
          }
        </div>
      </div>
      <div data-slot="row">
        <button uiCarouselPrevious aria-label="Previous slide">
          <svg lucideChevronUp></svg>
        </button>
        <button uiCarouselNext aria-label="Next slide">
          <svg lucideChevronDown></svg>
        </button>
      </div>
    </div>
  `,
})
class Example {
  readonly slides = [1, 2, 3, 4, 5]
}

export { Example }
