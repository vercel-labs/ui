import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPlayToggle,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/angular/carousel"

@Component({
  imports: [
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPlayToggle,
    CarouselPrevious,
    CarouselViewport,
    LucideChevronLeft,
    LucideChevronRight,
  ],
  template: `
    <div
      uiCarousel
      aria-label="Photos"
      defaultPlaying
      [interval]="4000"
      (beforePlayingChange)="
        log(($event.value ? 'Playing' : 'Stopped') + ' (' + $event.reason + ')')
      "
    >
      <div data-slot="controls">
        <button uiCarouselPlayToggle #carouselPlayToggle="uiCarouselPlayToggle">
          {{ carouselPlayToggle.state().playing ? "Pause" : "Play" }}
        </button>
      </div>
      <div data-slot="row">
        <button uiCarouselPrevious aria-label="Previous slide">
          <svg lucideChevronLeft></svg>
        </button>
        <div *uiCarouselViewport>
          <div *uiCarouselContent>
            @for (photo of photos; track photo.name) {
              <div uiCarouselItem>
                <div data-slot="tile">{{ photo.name }}</div>
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
  readonly log = useLog()

  readonly photos = [
    { name: "Dunes" },
    { name: "Forest" },
    { name: "Glacier" },
    { name: "Canyon" },
    { name: "Meadow" },
    { name: "Harbor" },
  ]
}

export { Example }
