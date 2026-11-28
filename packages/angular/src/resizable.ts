import {
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  resizable,
  type ResizableOptions,
  type ResizablePanelProps,
} from "@ui-sdk/core/resizable"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useId, usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeLayoutChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type ResizableLayoutChange = Parameters<
  NonNullable<ResizableOptions["onLayoutChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<ResizableOptions["onLayoutChange"]>>[0]
}

/**
 * What `(layoutCommit)` emits: the value and what came with it.
 * @experimental
 */
type ResizableLayoutCommit = Parameters<
  NonNullable<ResizableOptions["onLayoutCommit"]>
>[1] & {
  /** The value it reports. */
  value: Parameters<NonNullable<ResizableOptions["onLayoutCommit"]>>[0]
}

/**
 * The group: lays its panels out along its orientation. `[(layout)]` controls it.
 * @experimental
 */
@Directive({ selector: "[uiResizable]", exportAs: "uiResizable" })
class Resizable {
  /** Logs every layout change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Each panel's size in percent, in panel order, like `[25, 75]`. Bind it with `[(layout)]` to control the group. */
  readonly layout: InputSignal<ResizableOptions["layout"]> = input()
  /** The layout at first, when uncontrolled. Panels' own `defaultSize` is what a server renders, so prefer that with server rendering. */
  readonly defaultLayout: InputSignal<ResizableOptions["defaultLayout"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly layoutChange = output<ResizableLayoutChange["value"]>()
  /** Runs while the layout changes: on every frame of a drag and every key. `$event.cancel()` keeps the layout. */
  readonly beforeLayoutChange = output<ResizableLayoutChange>()
  /** Runs once an interaction that changed the layout ends: the pointer lifts, the key comes up, or a panel collapses. For saving. */
  readonly layoutCommit = output<ResizableLayoutCommit>()
  /** The direction panels are laid out in. Horizontal panels sit side by side, vertical ones stack. */
  readonly orientation: InputSignal<ResizableOptions["orientation"]> = input()
  /** Stops every handle: no drags, no keys, and handles leave the tab order. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** How far an arrow key moves a handle, in percent. */
  readonly step = input(undefined, { transform: optionalNumber })
  /** How far Shift with an arrow key moves a handle, in percent. */
  readonly largeStep = input(undefined, { transform: optionalNumber })
  /** Saves the layout when an interaction completes and restores it on the next visit, under this key. */
  readonly autoSaveId: InputSignal<ResizableOptions["autoSaveId"]> = input()
  /** Where `autoSaveId` saves: anything with `getItem` and `setItem`, like a cookie store a server can read. */
  readonly storage: InputSignal<ResizableOptions["storage"]> = input()
  /** Resizes the group from anywhere. Create one with `createResizableController()`. */
  readonly controller: InputSignal<ResizableOptions["controller"]> = input()

  readonly handle = usePrimitive(resizable, () => ({
    debug: this.debug(),
    layout: this.layout(),
    defaultLayout: this.defaultLayout(),
    onLayoutChange: emitChange(this.beforeLayoutChange, this.layoutChange),
    onLayoutCommit: (value, details) =>
      this.layoutCommit.emit({ ...details, value }),
    orientation: this.orientation(),
    disabled: this.disabled(),
    step: this.step(),
    largeStep: this.largeStep(),
    autoSaveId: this.autoSaveId(),
    storage: this.storage(),
    controller: this.controller(),
  }))
  /** The resizable's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * A panel. Its size is written to `--resizable-panel-size` on every frame of a drag, so a resize runs no change detection unless the template reads the panel's state.
 * @experimental
 */
@Directive({ selector: "[uiResizablePanel]", exportAs: "uiResizablePanel" })
class ResizablePanel {
  readonly #id = useId()
  /** Identifies the panel for the controller, `aria-controls` and saved layouts. It's the element's id. Generated when left out. */
  readonly id = input<string>()

  /** Where the panel starts, in percent or with a unit, like `30` or `"240px"`. Without one, panels share what's left evenly. A server renders this size. */
  readonly defaultSize: InputSignal<ResizablePanelProps["defaultSize"]> =
    input()
  /** The smallest the panel gets while open. */
  readonly minSize: InputSignal<ResizablePanelProps["minSize"]> = input()
  /** The largest the panel gets. */
  readonly maxSize: InputSignal<ResizablePanelProps["maxSize"]> = input()
  /** Lets the panel collapse below its minimum to `collapsedSize`: by dragging past half the way there, with Enter or a double-click on its handle, or through the controller. */
  readonly collapsible = input(undefined, { transform: optionalBoolean })
  /** The size a collapsible panel collapses to. At 0, its content leaves the tab order and the accessibility tree. */
  readonly collapsedSize: InputSignal<ResizablePanelProps["collapsedSize"]> =
    input()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Resizable).handle, "panel", () => ({
    id: this.id() ?? this.#id,
    defaultSize: this.defaultSize(),
    minSize: this.minSize(),
    maxSize: this.maxSize(),
    collapsible: this.collapsible(),
    collapsedSize: this.collapsedSize(),
  })).state
}

/**
 * The handle between two panels: a focusable separator to drag or move with keys.
 * @experimental
 */
@Directive({ selector: "[uiResizableHandle]", exportAs: "uiResizableHandle" })
class ResizableHandle {
  readonly #id = useId()

  /** Stops this handle: no drags and no keys, and it leaves the tab order. */
  readonly disabled = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Resizable).handle, "handle", () => ({
    id: this.#id,
    disabled: this.disabled(),
  })).state
}

export {
  createResizableController,
  resizableStorageKey,
} from "@ui-sdk/core/resizable"
export type {
  ResizableApi,
  ResizableChangeOptions,
  ResizableController,
  ResizableHandleProps,
  ResizableHandleState,
  ResizableLayoutChangeDetails,
  ResizableLayoutChangeReason,
  ResizableLayoutCommitDetails,
  ResizableOptions,
  ResizablePanelProps,
  ResizablePanelState,
  ResizablePrimitive,
  ResizableSize,
  ResizableState,
  ResizableStorage,
} from "@ui-sdk/core/resizable"

export {
  Resizable,
  ResizableHandle,
  type ResizableLayoutChange,
  type ResizableLayoutCommit,
  ResizablePanel,
}
