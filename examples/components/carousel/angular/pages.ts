import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/angular/carousel"

@Component({
  imports: [
    Carousel,
    CarouselContent,
    CarouselIndicator,
    CarouselIndicatorGroup,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselViewport,
    LucideChevronLeft,
    LucideChevronRight,
  ],
  template: `
    <div uiCarousel aria-label="Products" [slidesPerPage]="3">
      <div data-slot="row">
        <button uiCarouselPrevious aria-label="Previous page">
          <svg lucideChevronLeft></svg>
        </button>
        <div *uiCarouselViewport>
          <div *uiCarouselContent>
            @for (product of products; track product) {
              <div uiCarouselItem>
                <div data-slot="tile">{{ product }}</div>
              </div>
            }
          </div>
        </div>
        <button uiCarouselNext aria-label="Next page">
          <svg lucideChevronRight></svg>
        </button>
      </div>
      <div data-slot="row">
        <div
          uiCarouselIndicatorGroup
          #indicators="uiCarouselIndicatorGroup"
          aria-label="Choose a page"
        >
          @for (page of pages(indicators.state().pageCount); track page) {
            <button
              uiCarouselIndicator
              [page]="page"
              [attr.aria-label]="'Page ' + page"
            ></button>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly products = [1, 2, 3, 4, 5, 6, 7, 8]

  pages(count: number | null) {
    return Array.from({ length: count ?? 3 }, (_, index) => index + 1)
  }
}

export { Example }
