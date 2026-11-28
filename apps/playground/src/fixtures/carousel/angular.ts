import { afterNextRender, Component, DestroyRef, inject } from "@angular/core"
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  type CarouselPageChange,
  CarouselPlayToggle,
  CarouselPrevious,
  CarouselViewport,
  createCarouselController,
} from "@ui-sdk/angular/carousel"
import {
  carouselFixture,
  carouselOptions,
} from "../../../../../tests/fixtures/carousel"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Carousel,
    CarouselContent,
    CarouselIndicator,
    CarouselIndicatorGroup,
    CarouselItem,
    CarouselNext,
    CarouselPlayToggle,
    CarouselPrevious,
    CarouselViewport,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiCarousel
        class="carousel"
        [attr.aria-label]="f.label"
        [style.--per-view]="perView"
        [controller]="controller"
        [page]="controlled ? page() : undefined"
        [slidesPerPage]="options.slidesPerPage"
        [align]="options.align"
        [orientation]="options.orientation"
        [loop]="options.loop"
        [defaultPlaying]="options.defaultPlaying"
        [interval]="options.interval"
        [defaultPage]="options.defaultPage"
        [drag]="options.drag"
        [skipSnaps]="options.skipSnaps"
        [dragFree]="options.dragFree"
        [disabled]="disabled()"
        (beforePageChange)="onPageChange($event)"
        (pageChangeComplete)="rested.set('' + $event)"
      >
        @if (playToggle) {
          <button
            uiCarouselPlayToggle
            #toggle="uiCarouselPlayToggle"
            class="carousel-toggle"
          >
            {{ toggle.state().playing ? f.stop : f.start }}
          </button>
        }
        <div uiCarouselViewport class="carousel-viewport">
          <div uiCarouselContent class="carousel-content">
            @for (slide of f.slides; track slide.title; let index = $index) {
              <div uiCarouselItem class="carousel-slide">
                <p>{{ slide.title }}</p>
                <a [href]="'?product=' + (index + 1)">{{ slide.link }}</a>
                @if (index === 2) {
                  <label> {{ f.field }} <input /></label>
                }
              </div>
            }
          </div>
        </div>
        <div class="carousel-controls">
          <button uiCarouselPrevious class="carousel-step">
            {{ f.previous }}
          </button>
          <button uiCarouselNext class="carousel-step">{{ f.next }}</button>
        </div>
        <div
          uiCarouselIndicatorGroup
          class="carousel-controls"
          [attr.aria-label]="f.indicators"
        >
          @for (slide of f.slides; track slide.title; let index = $index) {
            <button
              uiCarouselIndicator
              class="carousel-indicator"
              [attr.aria-label]="f.indicator(index + 1)"
            >
              {{ index + 1 }}
            </button>
          }
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Last reason">{{ reason() }}</output>
      <output aria-label="Rested on">{{ rested() }}</output>
      <button (click)="controller.setPage(4)">Show page 4</button>
      @if (controlled) {
        <button (click)="page.set(3)">Show page 3 by prop</button>
      }
      <button uiCarouselNext [controller]="controller">
        Next from outside
      </button>
    </div>
  `,
})
class Fixture {
  readonly f = carouselFixture
  readonly controller = createCarouselController()
  readonly #options = carouselOptions()
  readonly perView = this.#options.perView
  readonly playToggle = this.#options.playToggle
  readonly controlled = this.#options.controlled
  readonly options: {
    slidesPerPage?: number | "auto"
    align?: "start" | "center" | "end"
    orientation?: "horizontal" | "vertical"
    loop?: boolean
    defaultPlaying?: boolean
    interval?: number
    defaultPage?: number
    drag?: boolean
    skipSnaps?: boolean
    dragFree?: boolean
  } = this.#options.options
  readonly page = state(1)
  readonly disabled = state(false)
  readonly action = state("")
  readonly reason = state("")
  readonly rested = state("")

  constructor() {
    const media = this.#options.disabledMedia
    const destroyed = inject(DestroyRef)
    afterNextRender(() => {
      const change = () => this.disabled.set(!!media?.matches)
      change()
      media?.addEventListener("change", change)
      destroyed.onDestroy(() => media?.removeEventListener("change", change))
    })
  }

  onPageChange(change: CarouselPageChange) {
    if (change.value === this.#options.cancel) {
      return change.cancel()
    }
    if (this.controlled) {
      this.page.set(change.value)
    }
    this.action.set(String(change.value))
    this.reason.set(change.reason)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
