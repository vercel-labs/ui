import {
  Directive,
  Injectable,
  computed,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  carousel,
  type CarouselControlProps,
  type CarouselIndicatorGroupState,
  type CarouselIndicatorState,
  type CarouselNextState,
  type CarouselOptions,
  type CarouselPlayToggleState,
  type CarouselPreviousState,
} from "@ui-sdk/core/carousel"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import {
  PopupRoot,
  PopupTriggerScope,
  usePopupRoot,
  usePopupTrigger,
} from "./popup.ts"
import {
  useId,
  useOutsidePart,
  usePart,
  usePrimitive,
} from "./use-primitive.ts"

/**
 * What `(beforePageChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type CarouselPageChange = Parameters<
  NonNullable<CarouselOptions["onPageChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<CarouselOptions["onPageChange"]>>[0]
}

/**
 * What `(beforePlayingChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type CarouselPlayingChange = Parameters<
  NonNullable<CarouselOptions["onPlayingChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<CarouselOptions["onPlayingChange"]>>[0]
}

@Injectable()
class CarouselScope extends PopupRoot<typeof carousel> {}

@Injectable()
class CarouselGroupScope extends PopupTriggerScope<typeof carousel> {}

/**
 * A region of slides that scroll a page at a time. Name it with `aria-label`.
 * @experimental
 */
@Directive({
  selector: "[uiCarousel]",
  exportAs: "uiCarousel",
  providers: [CarouselScope],
})
class Carousel {
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The current page, from 1. Bind it with `[(page)]` to control the carousel. */
  readonly page = input(undefined, { transform: optionalNumber })
  /** The page it starts on, from 1, when uncontrolled. */
  readonly defaultPage = input(undefined, { transform: optionalNumber })
  /** The new value, after a change that wasn't canceled. */
  readonly pageChange = output<CarouselPageChange["value"]>()
  /** Runs when the page wants to change. `$event.reason` says why, and `$event.cancel()` stays on the page. */
  readonly beforePageChange = output<CarouselPageChange>()
  /** Runs once the slides come to rest on a page, after a spring, a drag or a scroll. */
  readonly pageChangeComplete =
    output<
      Parameters<NonNullable<CarouselOptions["onPageChangeComplete"]>>[0]
    >()
  /** Whether it rotates through the pages on its own. Bind it with `[(playing)]` to control rotation. */
  readonly playing = input(undefined, { transform: optionalBoolean })
  /** Whether it starts rotating, when uncontrolled. It doesn't when the user prefers reduced motion. */
  readonly defaultPlaying = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly playingChange = output<CarouselPlayingChange["value"]>()
  /** Runs when rotation wants to start or stop. */
  readonly beforePlayingChange = output<CarouselPlayingChange>()
  /** How long each page shows while rotating, in ms. */
  readonly interval = input(undefined, { transform: optionalNumber })
  /** Which way the slides scroll, and which arrow keys page. */
  readonly orientation: InputSignal<CarouselOptions["orientation"]> = input()
  /** Where a page lines up in the viewport. */
  readonly align: InputSignal<CarouselOptions["align"]> = input()
  /** How many slides one page holds. `"auto"` fits as many as the viewport shows. */
  readonly slidesPerPage: InputSignal<CarouselOptions["slidesPerPage"]> =
    input()
  /** Whether the slides go round: Next on the last page goes to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Whether a fast swipe can pass over pages. */
  readonly skipSnaps = input(undefined, { transform: optionalBoolean })
  /** Whether swipes and drags coast to wherever they stop instead of a page. */
  readonly dragFree = input(undefined, { transform: optionalBoolean })
  /** Whether swiping, dragging and scrolling move the slides. */
  readonly drag = input(undefined, { transform: optionalBoolean })
  /** Whether it stops being a carousel for now, like at a breakpoint where the slides lay out as a grid. The parts drop their roles, inline styles and listeners, and the controls hide. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Pages the carousel from anywhere, and connects parts outside it. Create one with `createCarouselController()`. */
  readonly controller: InputSignal<CarouselOptions["controller"]> = input()

  readonly handle = usePrimitive(carousel, () => ({
    debug: this.debug(),
    page: this.page(),
    defaultPage: this.defaultPage(),
    onPageChange: emitChange(this.beforePageChange, this.pageChange),
    onPageChangeComplete: (value) => this.pageChangeComplete.emit(value),
    playing: this.playing(),
    defaultPlaying: this.defaultPlaying(),
    onPlayingChange: emitChange(this.beforePlayingChange, this.playingChange),
    interval: this.interval(),
    orientation: this.orientation(),
    align: this.align(),
    slidesPerPage: this.slidesPerPage(),
    loop: this.loop(),
    skipSnaps: this.skipSnaps(),
    dragFree: this.dragFree(),
    drag: this.drag(),
    disabled: this.disabled(),
    controller: this.controller(),
  }))
  /** The carousel's state, as a signal. */
  readonly state = usePart(this.handle, "root").state

  constructor() {
    usePopupRoot(CarouselScope, { handle: this.handle }, () =>
      this.controller()
    )
  }
}

/**
 * The scrolling window onto the slides. Touch, wheels and keys scroll it natively.
 * @experimental
 */
@Directive({ selector: "[uiCarouselViewport]", exportAs: "uiCarouselViewport" })
class CarouselViewport {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(CarouselScope).handle, "viewport").state
}

/**
 * The row, or column, of slides inside the viewport.
 * @experimental
 */
@Directive({ selector: "[uiCarouselContent]", exportAs: "uiCarouselContent" })
class CarouselContent {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(CarouselScope).handle, "content").state
}

/**
 * One slide. It's labelled "1 of 5" unless it has an `aria-label`, and inert while out of view.
 * @experimental
 */
@Directive({ selector: "[uiCarouselItem]", exportAs: "uiCarouselItem" })
class CarouselItem {
  readonly #id = useId()
  /** The part's state, as a signal. */
  readonly state = usePart(inject(CarouselScope).handle, "item", () => ({
    id: this.#id,
  })).state
}

/**
 * Goes to the previous page. `aria-disabled` on the first page without `loop`, where it stays focusable.
 * @experimental
 */
@Directive({ selector: "[uiCarouselPrevious]", exportAs: "uiCarouselPrevious" })
class CarouselPrevious {
  /** The carousel this part drives when it isn't inside one, like buttons in a page header. */
  readonly controller: InputSignal<CarouselControlProps["controller"]> = input()

  readonly #part = usePopupTrigger(CarouselScope, "previous", () => ({}), {
    controller: () => this.controller(),
  })
  /** The button's state, as a signal. */
  readonly state = computed<CarouselPreviousState>(
    () => this.#part.state() ?? { disabled: true }
  )
}

/**
 * Goes to the next page. `aria-disabled` on the last page without `loop`, where it stays focusable.
 * @experimental
 */
@Directive({ selector: "[uiCarouselNext]", exportAs: "uiCarouselNext" })
class CarouselNext {
  /** The carousel this part drives when it isn't inside one, like buttons in a page header. */
  readonly controller: InputSignal<CarouselControlProps["controller"]> = input()

  readonly #part = usePopupTrigger(CarouselScope, "next", () => ({}), {
    controller: () => this.controller(),
  })
  /** The button's state, as a signal. */
  readonly state = computed<CarouselNextState>(
    () => this.#part.state() ?? { disabled: true }
  )
}

/**
 * The indicators, as a tablist with one tab stop. Its state has `pageCount`, for rendering one indicator per page.
 * @experimental
 */
@Directive({
  selector: "[uiCarouselIndicatorGroup]",
  exportAs: "uiCarouselIndicatorGroup",
  providers: [CarouselGroupScope],
})
class CarouselIndicatorGroup {
  /** The carousel this part drives when it isn't inside one, like buttons in a page header. */
  readonly controller: InputSignal<CarouselControlProps["controller"]> = input()

  readonly #part = usePopupTrigger(
    CarouselScope,
    "indicator-group",
    () => ({}),
    {
      controller: () => this.controller(),
      plain: () => ({}),
      inside: CarouselGroupScope,
    }
  )
  /** The group's state, as a signal. */
  readonly state = computed<CarouselIndicatorGroupState>(
    () => this.#part.state() ?? { page: 1, pageCount: null }
  )
}

/**
 * Shows a page and goes to it. Indicators past the page count hide themselves.
 * @experimental
 */
@Directive({
  selector: "[uiCarouselIndicator]",
  exportAs: "uiCarouselIndicator",
})
class CarouselIndicator {
  /** The page it shows and selects, from 1. Inferred from the indicators' order when left out. */
  readonly page = input(undefined, { transform: optionalNumber })

  readonly #id = useId()
  readonly #carousel = inject(CarouselScope, { optional: true })
  readonly #group = inject(CarouselGroupScope, { optional: true })
  readonly #part = useOutsidePart(
    () => (this.#group?.root() ?? this.#carousel ?? undefined)?.handle,
    "indicator",
    () => ({ id: this.#id, page: this.page() }),
    {},
    () => ({ type: "button" })
  )
  /** The indicator's state, as a signal. */
  readonly state = computed<CarouselIndicatorState>(
    () => this.#part.state() ?? { page: this.page() ?? 0, selected: false }
  )
}

/**
 * Starts and stops rotation. Label it from `playing` in its state, as the carousel pattern asks.
 * @experimental
 */
@Directive({
  selector: "[uiCarouselPlayToggle]",
  exportAs: "uiCarouselPlayToggle",
})
class CarouselPlayToggle {
  /** The carousel this part drives when it isn't inside one, like buttons in a page header. */
  readonly controller: InputSignal<CarouselControlProps["controller"]> = input()

  readonly #part = usePopupTrigger(CarouselScope, "play-toggle", () => ({}), {
    controller: () => this.controller(),
  })
  /** The button's state, as a signal. */
  readonly state = computed<CarouselPlayToggleState>(
    () => this.#part.state() ?? { playing: false, paused: false }
  )
}

export { createCarouselController } from "@ui-sdk/core/carousel"
export type {
  CarouselAlign,
  CarouselApi,
  CarouselContentState,
  CarouselControlProps,
  CarouselController,
  CarouselIndicatorGroupState,
  CarouselIndicatorProps,
  CarouselIndicatorState,
  CarouselItemState,
  CarouselNextState,
  CarouselOptions,
  CarouselOrientation,
  CarouselPageChangeReason,
  CarouselPageOptions,
  CarouselPlayToggleState,
  CarouselPlayingChangeReason,
  CarouselPlayingOptions,
  CarouselPreviousState,
  CarouselPrimitive,
  CarouselSlidesPerPage,
  CarouselState,
  CarouselStepState,
  CarouselViewportState,
} from "@ui-sdk/core/carousel"

export {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  type CarouselPageChange,
  type CarouselPlayingChange,
  CarouselPlayToggle,
  CarouselPrevious,
  CarouselViewport,
}
