import { Directive, inject, input, output } from "@angular/core"
import {
  collapsible,
  type CollapsibleController,
  type CollapsibleOpenChangeReason,
} from "@ui-sdk/core/collapsible"
import { optionalBoolean } from "./inputs.ts"
import { emitChange, type Change } from "./outputs.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeOpenChange)` emits: whether the panel is about to open, why,
 * and `cancel()` to leave it as it is.
 * @experimental
 */
type CollapsibleOpenChange = Change<boolean, CollapsibleOpenChangeReason>

/**
 * A panel of content that a button shows and hides. Put its trigger and panel inside.
 * @experimental
 */
@Directive({ selector: "[uiCollapsible]", exportAs: "uiCollapsible" })
class Collapsible {
  /** Whether the panel is open. Bind it with `[(open)]` to control the collapsible. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** Whether the panel is open at first, when uncontrolled. */
  readonly defaultOpen = input(undefined, { transform: optionalBoolean })
  /** Stops the trigger from opening or closing the panel. The trigger stays focusable. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Opens and closes the panel from anywhere. Create one with `createCollapsibleController()`. */
  readonly controller = input<CollapsibleController>()
  /** Whether the panel is open, after a change that wasn't canceled. */
  readonly openChange = output<boolean>()
  /** Runs before the panel opens or closes, with the reason and `cancel()`. */
  readonly beforeOpenChange = output<CollapsibleOpenChange>()
  /** Runs once the panel has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()

  readonly handle = usePrimitive(collapsible, () => ({
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    disabled: this.disabled(),
    controller: this.controller(),
    onOpenChange: emitChange(this.beforeOpenChange, this.openChange),
    onOpenChangeComplete: (open) => this.openChangeComplete.emit(open),
  }))
  /** The collapsible's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * The button that opens and closes the panel. It says whether the panel is open with `aria-expanded`.
 * @experimental
 */
@Directive({
  selector: "[uiCollapsibleTrigger]",
  exportAs: "uiCollapsibleTrigger",
})
class CollapsibleTrigger {
  /** The trigger's state, as a signal. */
  readonly state = usePart(inject(Collapsible).handle, "trigger").state
}

/**
 * The content the trigger shows and hides. Closed, it stays in the page,
 * hidden. `*uiCollapsiblePanel` renders it only while it's open.
 * @experimental
 */
@Directive({ selector: "[uiCollapsiblePanel]", exportAs: "uiCollapsiblePanel" })
class CollapsiblePanel {
  /** Whether the `*` form keeps the panel in the page, hidden, while closed. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })
  /** Keeps the closed panel as `hidden="until-found"`, so find in page can match its text and open it. */
  readonly hiddenUntilFound = input(undefined, { transform: optionalBoolean })
  /** The panel's state, as a signal. */
  readonly state = usePart(inject(Collapsible).handle, "panel", () => ({
    keepMounted: this.keepMounted(),
    hiddenUntilFound: this.hiddenUntilFound(),
  })).state

  static ngTemplateContextGuard(
    _directive: CollapsiblePanel,
    context: unknown
  ): context is { $implicit: ReturnType<CollapsiblePanel["state"]> } {
    return true
  }
}

export { createCollapsibleController } from "@ui-sdk/core/collapsible"
export type {
  CollapsibleApi,
  CollapsibleChangeOptions,
  CollapsibleController,
  CollapsibleOpenChangeReason,
  CollapsibleOptions,
  CollapsiblePanelProps,
  CollapsiblePanelState,
  CollapsiblePrimitive,
  CollapsibleState,
  CollapsibleTriggerProps,
  CollapsibleTriggerState,
} from "@ui-sdk/core/collapsible"

export {
  Collapsible,
  type CollapsibleOpenChange,
  CollapsiblePanel,
  CollapsibleTrigger,
}
