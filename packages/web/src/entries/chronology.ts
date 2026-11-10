// Importing this defines <ui-chronology> and its parts. On the server it does nothing.
import { defineChronologyElements } from "../chronology"

defineChronologyElements()

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
export type { UiChronologyElement } from "../events"
export { createChronologyController } from "@ui-sdk/core/chronology"
