import { Component, signal } from "@angular/core"
import {
  LucideCheck,
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronRight,
} from "@lucide/angular"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/angular/carousel"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"

type Align = "start" | "center" | "end"

@Component({
  imports: [
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselViewport,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
    LucideChevronLeft,
    LucideChevronRight,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <ng-container
          uiSelect
          [items]="alignments"
          [value]="align()"
          (beforeValueChange)="setAlign($event.value)"
        >
          <div uiSelectLabel>Align</div>
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (option of alignments; track option.value) {
              <div uiSelectItem [value]="option.value">
                {{ option.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
      <div uiCarousel aria-label="Photos" [align]="align()" [defaultPage]="2">
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

  readonly alignments = [
    { value: "start", label: "Start" },
    { value: "center", label: "Center" },
    { value: "end", label: "End" },
  ]

  readonly align = signal<Align>("center")

  setAlign(value: string | null) {
    if (value) {
      this.align.set(value as Align)
    }
  }
}

export { Example }
