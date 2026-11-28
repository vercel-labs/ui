import { Component } from "@angular/core"
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselViewport,
} from "@ui-sdk/angular/carousel"

@Component({
  imports: [
    Carousel,
    CarouselContent,
    CarouselIndicator,
    CarouselIndicatorGroup,
    CarouselItem,
    CarouselViewport,
  ],
  template: `
    <div uiCarousel aria-label="Photos">
      <div *uiCarouselViewport>
        <div *uiCarouselContent>
          @for (photo of photos; track photo.name) {
            <div uiCarouselItem>
              <div data-slot="tile">
                {{ photo.name }}
              </div>
            </div>
          }
        </div>
      </div>
      <div uiCarouselIndicatorGroup aria-label="Choose a photo">
        @for (photo of photos; track photo.name; let index = $index) {
          <button
            uiCarouselIndicator
            [page]="index + 1"
            [aria-label]="photo.name"
          ></button>
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
}

export { Example }
