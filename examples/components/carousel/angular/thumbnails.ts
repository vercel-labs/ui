import { Component, ElementRef, signal, viewChild } from "@angular/core"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselViewport,
} from "@ui-sdk/angular/carousel"

@Component({
  imports: [Carousel, CarouselContent, CarouselItem, CarouselViewport],
  template: `
    <div data-slot="stack" #block>
      <div
        uiCarousel
        [(page)]="page"
        aria-label="Photos"
        (pageChange)="follow($event)"
      >
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
      </div>
      <div uiCarousel aria-label="Thumbnails" dragFree slidesPerPage="auto">
        <div *uiCarouselViewport>
          <div *uiCarouselContent>
            @for (photo of photos; track photo.name; let index = $index) {
              <div uiCarouselItem [aria-label]="photo.name">
                <button
                  type="button"
                  [attr.aria-pressed]="page() === index + 1"
                  (click)="page.set(index + 1)"
                >
                  {{ photo.name }}
                </button>
              </div>
            }
          </div>
        </div>
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

  readonly page = signal(1)

  readonly block = viewChild<ElementRef<HTMLElement>>("block")

  readonly follow = (next: number) =>
    this.block()
      ?.nativeElement.querySelectorAll("button")
      [next - 1]?.scrollIntoView({ block: "nearest", inline: "nearest" })
}

export { Example }
