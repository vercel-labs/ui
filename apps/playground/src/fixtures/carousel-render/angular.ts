import { Component } from "@angular/core"
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselViewport,
} from "@ui-sdk/angular/carousel"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Carousel,
    CarouselContent,
    CarouselIndicator,
    CarouselIndicatorGroup,
    CarouselItem,
    CarouselNext,
    CarouselViewport,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiCarousel
        class="carousel"
        aria-label="Photos"
        (pageChange)="action.set('' + $event)"
      >
        <div uiCarouselViewport class="carousel-viewport">
          <div uiCarouselContent>
            @for (slide of slides; track slide) {
              <div
                uiCarouselItem
                #item="uiCarouselItem"
                class="carousel-slide"
                [class.is-active]="item.state().active"
                [class.is-inactive]="!item.state().active"
              >
                {{ slide }}
              </div>
            }
          </div>
        </div>
        <button uiCarouselNext #next="uiCarouselNext">
          {{ next.state().disabled ? "No more photos" : "Next photo" }}
        </button>
        <div uiCarouselIndicatorGroup aria-label="Choose a photo">
          @for (slide of slides; track slide; let index = $index) {
            <a
              uiCarouselIndicator
              [attr.aria-label]="'Photo ' + (index + 1)"
              [href]="'#photo-' + (index + 1)"
              >{{ index + 1 }}</a
            >
          }
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly slides = ["One", "Two", "Three"]
  readonly action = state("")
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
