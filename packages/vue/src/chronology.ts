import { chronology } from "@ui-sdk/core/chronology"
import { createParts } from "./create-parts"

const parts = createParts(chronology, {
  root: "div",
  item: "div",
  marker: "div",
  connector: "div",
  time: "time",
  title: "div",
  description: "div",
})

/**
 * A list of dated events, like an activity feed or an order's history, with
 * one tab stop and arrow keys between events. `feed` makes it a feed of
 * articles that loads more as people scroll.
 * @experimental
 */
const Chronology = parts.Root

/**
 * One event. Arrow keys move between events, and links and buttons inside
 * stay in the tab order.
 * @experimental
 */
const ChronologyItem = parts.Item

/**
 * The dot or icon that marks its event on the line. Hidden from assistive
 * technology.
 * @experimental
 */
const ChronologyMarker = parts.Marker

/**
 * The line between its event's marker and the next one. Hidden from assistive
 * technology.
 * @experimental
 */
const ChronologyConnector = parts.Connector

/**
 * When its event happened, as a `<time>`. Pass `dateTime` so machines can read
 * it. It describes the event.
 * @experimental
 */
const ChronologyTime = parts.Time

/**
 * What happened. It names its event.
 * @experimental
 */
const ChronologyTitle = parts.Title

/**
 * More about its event. It describes the event.
 * @experimental
 */
const ChronologyDescription = parts.Description

export { createChronologyController } from "@ui-sdk/core/chronology"
export type {
  ChronologyApi,
  ChronologyConnectorState,
  ChronologyController,
  ChronologyDescriptionState,
  ChronologyItemProps,
  ChronologyItemState,
  ChronologyMarkerState,
  ChronologyOptions,
  ChronologyOrientation,
  ChronologyPrimitive,
  ChronologyState,
  ChronologyStatus,
  ChronologyTimeState,
  ChronologyTitleState,
} from "@ui-sdk/core/chronology"

export {
  Chronology,
  ChronologyConnector,
  ChronologyDescription,
  ChronologyItem,
  ChronologyMarker,
  ChronologyTime,
  ChronologyTitle,
}
