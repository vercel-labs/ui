import { Component, effect, ElementRef, viewChild } from "@angular/core"
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
    <div
      uiCarousel
      #carousel="uiCarousel"
      aria-label="Photos"
      (pageChange)="rememberFocus()"
    >
      <div *uiCarouselViewport>
        <div *uiCarouselContent>
          @for (photo of photos; track photo.name) {
            <div uiCarouselItem #carouselItem="uiCarouselItem">
              <div data-slot="tile">
                {{ photo.name }}
                <span data-slot="hint">
                  {{ carouselItem.state().index + 1 }} / {{ photos.length
                  }}{{ carouselItem.state().active ? " · showing" : "" }}
                </span>
              </div>
            </div>
          }
        </div>
      </div>
      <div data-slot="row">
        <button uiCarouselPrevious>
          <svg lucideChevronLeft></svg>
          Previous
        </button>
        @if (carousel.state().page === carousel.state().pageCount) {
          <a #seeAll href="https://example.com/gallery">See all photos</a>
        } @else {
          <button uiCarouselNext>
            Next
            <svg lucideChevronRight></svg>
          </button>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly photos = [
    { name: "Dunes" },
    { name: "Forest" },
    { name: "Glacier" },
    { name: "Canyon" },
    { name: "Meadow" },
    { name: "Harbor" },
  ]

  nextFocused = false

  readonly rememberFocus = () => {
    this.nextFocused =
      typeof document !== "undefined" &&
      document.activeElement?.getAttribute("data-slot") === "carousel-next"
  }

  readonly seeAll = viewChild<ElementRef<HTMLAnchorElement>>("seeAll")

  constructor() {
    effect(() => {
      const link = this.seeAll()?.nativeElement
      if (link && this.nextFocused) {
        link.focus()
      }
    })
  }
}

export { Example }
