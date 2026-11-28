import {
  computed,
  Directive,
  inject,
  input,
  type InputSignal,
} from "@angular/core"
import {
  timeline,
  type TimelineItemProps,
  type TimelineOptions,
} from "@ui-sdk/core/timeline"
import { optionalBoolean } from "./inputs.ts"
import { useId, usePart, usePrimitive } from "./use-primitive.ts"

/**
 * A list of dated events, like an activity feed or an order's history, with one tab stop and arrow keys between events. `feed` makes it a feed of articles that loads more as people scroll.
 * @experimental
 */
@Directive({ selector: "[uiTimeline]", exportAs: "uiTimeline" })
class Timeline {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Which arrow keys move between events: up and down, or left and right. */
  readonly orientation: InputSignal<TimelineOptions["orientation"]> = input()
  /** Whether arrow keys wrap from the last event to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Whether the events are a feed that loads more as people scroll, rather than a list. Each event becomes an article with its position, and Page Down and Page Up move between them from anywhere inside one. */
  readonly feed = input(undefined, { transform: optionalBoolean })
  /** Whether a feed is loading or changing events, which sets `aria-busy` so screen readers wait until it's done. Only a feed reads it. */
  readonly busy = input(undefined, { transform: optionalBoolean })
  /** Focuses an event from anywhere. Create one with `createTimelineController()`. */
  readonly controller: InputSignal<TimelineOptions["controller"]> = input()

  readonly handle = usePrimitive(timeline, () => ({
    debug: this.debug(),
    orientation: this.orientation(),
    loop: this.loop(),
    feed: this.feed(),
    busy: this.busy(),
    controller: this.controller(),
  }))
  /** The timeline's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * One event. Arrow keys move between events, and links and buttons inside stay in the tab order.
 * @experimental
 */
@Directive({ selector: "[uiTimelineItem]", exportAs: "uiTimelineItem" })
class TimelineItem {
  /** Names the event for the controller's `focus()`. Generated when left out. */
  readonly value: InputSignal<TimelineItemProps["value"]> = input()
  /** Where the event stands in a process. The `"current"` one sets `aria-current="step"` and takes the tab stop first. */
  readonly status: InputSignal<TimelineItemProps["status"]> = input()
  readonly #generated = useId()
  /** The event's value: the one it was given, or the generated one. */
  readonly key = computed(() => this.value() ?? this.#generated)

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Timeline).handle, "item", () => ({
    value: this.key(),
    status: this.status(),
  })).state
}

/**
 * The dot or icon that marks its event on the line. Hidden from assistive technology.
 * @experimental
 */
@Directive({ selector: "[uiTimelineMarker]", exportAs: "uiTimelineMarker" })
class TimelineMarker {
  readonly #item = inject(TimelineItem, { optional: true })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Timeline).handle, "marker", () => ({
    value: this.#item?.key(),
    status: this.#item?.status(),
  })).state
}

/**
 * The line between its event's marker and the next one. Hidden from assistive technology.
 * @experimental
 */
@Directive({
  selector: "[uiTimelineConnector]",
  exportAs: "uiTimelineConnector",
})
class TimelineConnector {
  readonly #item = inject(TimelineItem, { optional: true })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Timeline).handle, "connector", () => ({
    value: this.#item?.key(),
    status: this.#item?.status(),
  })).state
}

/**
 * When its event happened, as a `<time>`. Pass `datetime` so machines can read it. It describes the event.
 * @experimental
 */
@Directive({ selector: "[uiTimelineTime]", exportAs: "uiTimelineTime" })
class TimelineTime {
  readonly #item = inject(TimelineItem, { optional: true })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Timeline).handle, "time", () => ({
    value: this.#item?.key(),
    status: this.#item?.status(),
  })).state
}

/**
 * What happened. It names its event.
 * @experimental
 */
@Directive({ selector: "[uiTimelineTitle]", exportAs: "uiTimelineTitle" })
class TimelineTitle {
  readonly #item = inject(TimelineItem, { optional: true })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Timeline).handle, "title", () => ({
    value: this.#item?.key(),
    status: this.#item?.status(),
  })).state
}

/**
 * More about its event. It describes the event.
 * @experimental
 */
@Directive({
  selector: "[uiTimelineDescription]",
  exportAs: "uiTimelineDescription",
})
class TimelineDescription {
  readonly #item = inject(TimelineItem, { optional: true })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Timeline).handle, "description", () => ({
    value: this.#item?.key(),
    status: this.#item?.status(),
  })).state
}

export { createTimelineController } from "@ui-sdk/core/timeline"
export type {
  TimelineApi,
  TimelineConnectorState,
  TimelineController,
  TimelineDescriptionState,
  TimelineItemProps,
  TimelineItemState,
  TimelineMarkerState,
  TimelineOptions,
  TimelineOrientation,
  TimelinePrimitive,
  TimelineState,
  TimelineStatus,
  TimelineTimeState,
  TimelineTitleState,
} from "@ui-sdk/core/timeline"

export {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
}
