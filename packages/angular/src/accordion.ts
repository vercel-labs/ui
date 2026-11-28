import { computed, Directive, inject, input, output } from "@angular/core"
import {
  accordion,
  type AccordionController,
  type AccordionValueChangeReason,
} from "@ui-sdk/core/accordion"
import { optionalBoolean } from "./inputs.ts"
import { emitChange, emitTypedChange, type Change } from "./outputs.ts"
import { useId, usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the items about to be open, why, and
 * `cancel()` to leave them as they are.
 * @experimental
 */
type AccordionValueChange<Value extends string = string> = Change<
  Value[],
  AccordionValueChangeReason
>

/**
 * What an item's `(beforeOpenChange)` emits: whether it is about to open,
 * why, and `cancel()` to leave it as it is.
 * @experimental
 */
type AccordionItemOpenChange = Change<boolean, AccordionValueChangeReason>

/**
 * A stack of items that each open a section of content. One item is open at a time unless `multiple` is set.
 * @experimental
 */
@Directive({ selector: "[uiAccordion]", exportAs: "uiAccordion" })
class Accordion<Value extends string = string> {
  /** The open items' values. Bind it with `[(value)]` to control the accordion. */
  readonly value = input<Value[]>()
  /** The items open at first, when uncontrolled. */
  readonly defaultValue = input<Value[]>()
  /** Whether several items can be open at once. Otherwise opening one closes the others. */
  readonly multiple = input(undefined, { transform: optionalBoolean })
  /** Whether the open item can close when only one may be open. */
  readonly collapsible = input(undefined, { transform: optionalBoolean })
  /** Stops every item from opening or closing. Triggers stay focusable. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Whether panels in the `*` form stay in the page, hidden, while closed. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })
  /** Keeps closed panels as `hidden="until-found"`, so find in page can match their text and open them. */
  readonly hiddenUntilFound = input(undefined, { transform: optionalBoolean })
  /** Opens and closes items from anywhere. Create one with `createAccordionController()`. */
  readonly controller = input<AccordionController>()
  /** The open items' values, after a change that wasn't canceled. */
  readonly valueChange = output<Value[]>()
  /** Runs before items open or close, with the reason and `cancel()`. */
  readonly beforeValueChange = output<AccordionValueChange<Value>>()

  readonly handle = usePrimitive(accordion, () => ({
    value: this.value(),
    defaultValue: this.defaultValue(),
    multiple: this.multiple(),
    collapsible: this.collapsible(),
    disabled: this.disabled(),
    keepMounted: this.keepMounted(),
    hiddenUntilFound: this.hiddenUntilFound(),
    controller: this.controller(),
    onValueChange: emitTypedChange(this.beforeValueChange, this.valueChange),
  }))
  /** The accordion's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * One item: a header with its trigger, and the panel the trigger opens.
 * @experimental
 */
@Directive({ selector: "[uiAccordionItem]", exportAs: "uiAccordionItem" })
class AccordionItem {
  readonly #id = useId()
  /** Identifies the item. The accordion's value lists the open items' values. Defaults to a generated id. */
  readonly value = input<string>()
  /** Stops the item from opening or closing. Its trigger stays focusable. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Runs before the item opens or closes, before the accordion's `(beforeValueChange)`. */
  readonly beforeOpenChange = output<AccordionItemOpenChange>()
  /** Runs once the item's panel has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()

  readonly handle = inject(Accordion).handle
  /** The item's value, given or generated, which its parts share. */
  readonly key = computed(() => this.value() ?? this.#id)
  /** The item's state, as a signal. */
  readonly state = usePart(this.handle, "item", () => ({
    value: this.key(),
    disabled: this.disabled(),
    onOpenChange: emitChange(this.beforeOpenChange),
    onOpenChangeComplete: (open) => this.openChangeComplete.emit(open),
  })).state
}

/**
 * A heading around the trigger, so screen readers can move between items by heading.
 * @experimental
 */
@Directive({ selector: "[uiAccordionHeader]", exportAs: "uiAccordionHeader" })
class AccordionHeader {
  readonly #item = inject(AccordionItem)
  /** The header's state, as a signal. */
  readonly state = usePart(this.#item.handle, "header", () => ({
    value: this.#item.key(),
  })).state
}

/**
 * The button that opens and closes its item's panel. Put it inside the item's `uiAccordionHeader`.
 * @experimental
 */
@Directive({ selector: "[uiAccordionTrigger]", exportAs: "uiAccordionTrigger" })
class AccordionTrigger {
  readonly #item = inject(AccordionItem)
  /** Stops this trigger from opening or closing its item. It stays focusable. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** The trigger's state, as a signal. */
  readonly state = usePart(this.#item.handle, "trigger", () => ({
    value: this.#item.key(),
    disabled: this.disabled(),
  })).state
}

/**
 * The content its item's trigger shows and hides. Closed, it stays in the
 * page, hidden. `*uiAccordionPanel` renders it only while it's open.
 * @experimental
 */
@Directive({ selector: "[uiAccordionPanel]", exportAs: "uiAccordionPanel" })
class AccordionPanel {
  readonly #item = inject(AccordionItem)
  /** Whether the `*` form keeps the panel in the page, hidden, while closed. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })
  /** Keeps the closed panel as `hidden="until-found"`, so find in page can match its text and open it. */
  readonly hiddenUntilFound = input(undefined, { transform: optionalBoolean })
  /** The panel's state, as a signal. */
  readonly state = usePart(this.#item.handle, "panel", () => ({
    value: this.#item.key(),
    keepMounted: this.keepMounted(),
    hiddenUntilFound: this.hiddenUntilFound(),
  })).state

  static ngTemplateContextGuard(
    _directive: AccordionPanel,
    context: unknown
  ): context is { $implicit: ReturnType<AccordionPanel["state"]> } {
    return true
  }
}

export { createAccordionController } from "@ui-sdk/core/accordion"
export type {
  AccordionApi,
  AccordionChangeOptions,
  AccordionController,
  AccordionHeaderProps,
  AccordionHeaderState,
  AccordionItemProps,
  AccordionItemState,
  AccordionOptions,
  AccordionPanelProps,
  AccordionPanelState,
  AccordionPrimitive,
  AccordionState,
  AccordionTriggerProps,
  AccordionTriggerState,
  AccordionValueChangeReason,
} from "@ui-sdk/core/accordion"

export {
  Accordion,
  AccordionHeader,
  AccordionItem,
  type AccordionItemOpenChange,
  AccordionPanel,
  AccordionTrigger,
  type AccordionValueChange,
}
