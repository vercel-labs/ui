import { Directive, inject, input, type InputSignal } from "@angular/core"
import {
  scrollArea,
  type ScrollAreaOptions,
  type ScrollAreaScrollbarProps,
} from "@ui-sdk/core/scroll-area"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * Groups the parts. The scrollbars are placed against it.
 * @experimental
 */
@Directive({ selector: "[uiScrollArea]", exportAs: "uiScrollArea" })
class ScrollArea {
  /** Logs state changes. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** When the scrollbars show: "auto" whenever the content overflows, "always", "scroll" while scrolling, and "hover" while scrolling or hovered. */
  readonly type: InputSignal<ScrollAreaOptions["type"]> = input()
  /** How long scrollbars stay after they stop being needed, in ms, with "scroll" and "hover". */
  readonly scrollHideDelay = input(undefined, { transform: optionalNumber })
  /** Keeps the end in view while the content grows, like a chat or streamed output. */
  readonly stickToEnd = input(undefined, { transform: optionalBoolean })
  /** Drives it from anywhere. Create one with `createScrollAreaController()`. */
  readonly controller: InputSignal<ScrollAreaOptions["controller"]> = input()

  readonly handle = usePrimitive(scrollArea, () => ({
    debug: this.debug(),
    type: this.type(),
    scrollHideDelay: this.scrollHideDelay(),
    stickToEnd: this.stickToEnd(),
    controller: this.controller(),
  }))
  /** The scroll area's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * The native scroller. Keyboard, wheels, touch, find in page and screen readers scroll it.
 * @experimental
 */
@Directive({
  selector: "[uiScrollAreaViewport]",
  exportAs: "uiScrollAreaViewport",
})
class ScrollAreaViewport {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ScrollArea).handle, "viewport").state
}

/**
 * Wraps the content inside the viewport.
 * @experimental
 */
@Directive({
  selector: "[uiScrollAreaContent]",
  exportAs: "uiScrollAreaContent",
})
class ScrollAreaContent {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ScrollArea).handle, "content").state
}

/**
 * A scrollbar for one axis, over the viewport's edge.
 * @experimental
 */
@Directive({
  selector: "[uiScrollAreaScrollbar]",
  exportAs: "uiScrollAreaScrollbar",
})
class ScrollAreaScrollbar {
  /** The axis the scrollbar scrolls. */
  readonly orientation: InputSignal<ScrollAreaScrollbarProps["orientation"]> =
    input()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(ScrollArea).handle, "scrollbar", () => ({
    id: this.orientation() ?? "vertical",
    orientation: this.orientation(),
  })).state
}

/**
 * The part of the scrollbar that shows where the view is, and drags.
 * @experimental
 */
@Directive({ selector: "[uiScrollAreaThumb]", exportAs: "uiScrollAreaThumb" })
class ScrollAreaThumb {
  readonly #scrollbar = inject(ScrollAreaScrollbar, { optional: true })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(ScrollArea).handle, "thumb", () => ({
    id: this.#scrollbar?.orientation() ?? "vertical",
    orientation: this.#scrollbar?.orientation(),
  })).state
}

/**
 * Where the two scrollbars meet.
 * @experimental
 */
@Directive({ selector: "[uiScrollAreaCorner]", exportAs: "uiScrollAreaCorner" })
class ScrollAreaCorner {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ScrollArea).handle, "corner").state
}

/**
 * A button that scrolls to the end, like "Jump to latest". Name it with its content.
 * @experimental
 */
@Directive({
  selector: "[uiScrollAreaScrollToEnd]",
  exportAs: "uiScrollAreaScrollToEnd",
})
class ScrollAreaScrollToEnd {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ScrollArea).handle, "scroll-to-end").state
}

export { createScrollAreaController } from "@ui-sdk/core/scroll-area"
export type {
  ScrollAreaController,
  ScrollAreaOptions,
  ScrollAreaPrimitive,
  ScrollAreaScrollOptions,
  ScrollAreaScrollToEndState,
  ScrollAreaScrollbarProps,
  ScrollAreaScrollbarState,
  ScrollAreaState,
  ScrollAreaThumbState,
  ScrollAreaType,
} from "@ui-sdk/core/scroll-area"

export {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaScrollToEnd,
  ScrollAreaThumb,
  ScrollAreaViewport,
}
