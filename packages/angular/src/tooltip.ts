import {
  Directive,
  Injectable,
  computed,
  inject,
  input,
  output,
  type InputSignal,
  type Signal,
} from "@angular/core"
import {
  tooltip,
  type TooltipContentProps,
  type TooltipContentState,
  type TooltipOptions,
  type TooltipShortcutProps,
  type TooltipShortcutState,
  type TooltipTriggerProps,
  type TooltipTriggerState,
} from "@ui-sdk/core/tooltip"
import {
  optionalBoolean,
  optionalNumber,
  type StarInput,
  starInputs,
  withStar,
} from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import {
  PopupRoot,
  PopupScope,
  PopupTriggerScope,
  usePopupContent,
  usePopupRoot,
  usePopupShortcut,
  usePopupTrigger,
} from "./popup.ts"
import { usePart, usePrimitive, type PopupContainer } from "./use-primitive.ts"

/**
 * What `(beforeOpenChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type TooltipOpenChange = Parameters<
  NonNullable<TooltipOptions["onOpenChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<TooltipOptions["onOpenChange"]>>[0]
}

/**
 * What `(beforePayloadChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type TooltipPayloadChange = Parameters<
  NonNullable<TooltipOptions["onPayloadChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<TooltipOptions["onPayloadChange"]>>[0]
}

@Injectable()
class TooltipScope extends PopupRoot<typeof tooltip> {}

@Injectable()
class TooltipTriggerScope extends PopupTriggerScope<typeof tooltip> {}

/**
 * A short label or hint that appears when the pointer rests on its trigger or keyboard focus reaches it.
 * @experimental
 */
@Directive({
  selector: "[uiTooltip]",
  exportAs: "uiTooltip",
  providers: [TooltipScope],
})
class Tooltip {
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Whether the tooltip is open. Bind it with `[(open)]` to control the tooltip. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** Whether the tooltip starts open, when uncontrolled. */
  readonly defaultOpen = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly openChange = output<TooltipOpenChange["value"]>()
  /** Runs when the tooltip wants to open or close. `$event.cancel()` stops it. */
  readonly beforeOpenChange = output<TooltipOpenChange>()
  /** Runs once the tooltip has finished opening or closing, after any animation. */
  readonly openChangeComplete =
    output<Parameters<NonNullable<TooltipOptions["onOpenChangeComplete"]>>[0]>()
  /** The new value, after a change that wasn't canceled. */
  readonly payloadChange = output<TooltipPayloadChange["value"]>()
  /** Runs when the payload the content shows changes. `$event.cancel()` keeps the previous one. */
  readonly beforePayloadChange = output<TooltipPayloadChange>()
  /** Milliseconds the pointer rests on the trigger before the tooltip opens. While another tooltip is open, or was a moment ago, the next one opens at once. */
  readonly delay = input(undefined, { transform: optionalNumber })
  /** Milliseconds before the tooltip closes once the pointer leaves the trigger and the tooltip. */
  readonly closeDelay = input(undefined, { transform: optionalNumber })
  /** Stops the tooltip from opening. The trigger keeps working. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Whether pressing the trigger opens and closes the tooltip, so touch screens can show it too. */
  readonly toggleable = input(undefined, { transform: optionalBoolean })
  /** Whether pressing the trigger closes the tooltip. */
  readonly closeOnPress = input(undefined, { transform: optionalBoolean })
  /** Whether the tooltip names its trigger (`"label"`) or adds a description to it (`"description"`). By default it names a trigger that has no name of its own. */
  readonly type: InputSignal<TooltipOptions["type"]> = input()
  /** The keyboard shortcut of what the trigger does, like `"mod+s"`, as a hint. A `TooltipShortcut` shows it. */
  readonly shortcut: InputSignal<TooltipOptions["shortcut"]> = input()
  /** Opens, closes and inspects the tooltip from anywhere, and connects triggers outside it. Create one with `createTooltipController()`. */
  readonly controller: InputSignal<TooltipOptions["controller"]> = input()
  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()

  readonly handle = usePrimitive(tooltip, () => ({
    debug: this.debug(),
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    onOpenChange: emitChange(this.beforeOpenChange, this.openChange),
    onOpenChangeComplete: (value) => this.openChangeComplete.emit(value),
    onPayloadChange: emitChange(this.beforePayloadChange, this.payloadChange),
    delay: this.delay(),
    closeDelay: this.closeDelay(),
    disabled: this.disabled(),
    toggleable: this.toggleable(),
    closeOnPress: this.closeOnPress(),
    type: this.type(),
    shortcut: this.shortcut(),
    controller: this.controller(),
  }))

  constructor() {
    usePopupRoot(
      TooltipScope,
      { handle: this.handle, container: this.container },
      () => this.controller()
    )
  }
}

/**
 * The element the tooltip names or describes, usually a button.
 * @experimental
 */
@Directive({
  selector: "[uiTooltipTrigger]",
  exportAs: "uiTooltipTrigger",
  providers: [TooltipTriggerScope],
})
class TooltipTrigger {
  /** Data for the content to render when this trigger opens the tooltip, like the row it belongs to. */
  readonly payload: InputSignal<TooltipTriggerProps["payload"]> = input()

  /** Connects a trigger outside the tooltip to the tooltip with this controller. */
  readonly controller: InputSignal<TooltipTriggerProps["controller"]> = input()

  readonly #part = usePopupTrigger(
    TooltipScope,
    "trigger",
    () => ({
      payload: this.payload(),
    }),
    {
      controller: () => this.controller(),
      inside: TooltipTriggerScope,
    }
  )
  /** The trigger's state, as a signal. */
  readonly state = computed<TooltipTriggerState>(
    () => this.#part.state() ?? { open: false }
  )
}

/**
 * The tooltip itself, positioned against its trigger. It's always in the page, hidden while closed, so the trigger can point at it.
 * @experimental
 */
@Directive({
  selector: "[uiTooltipContent]",
  exportAs: "uiTooltipContent",
  providers: [PopupScope],
})
class TooltipContent {
  /** Which side of the trigger the tooltip opens on. */
  readonly side: InputSignal<TooltipContentProps["side"]> = input()
  /** How the tooltip lines up with the trigger along that side. */
  readonly align: InputSignal<TooltipContentProps["align"]> = input()
  /** Gap between the trigger and the tooltip, in pixels. */
  readonly sideOffset = input(undefined, { transform: optionalNumber })
  /** Shift along the trigger, in pixels. */
  readonly alignOffset = input(undefined, { transform: optionalNumber })
  /** Space to keep from the viewport edges, in pixels. */
  readonly collisionPadding = input(undefined, { transform: optionalNumber })
  /** Space to keep between the arrow and the popup's corners, in pixels. */
  readonly arrowPadding = input(undefined, { transform: optionalNumber })
  /** Positions the popup against this instead of its trigger: an element, a CSS selector, a point like `{ x, y }`, or anything with `getBoundingClientRect()`. It's read on every check, so it can move. A controller's `open({ anchor })` wins for that open. */
  readonly anchor: InputSignal<TooltipContentProps["anchor"]> = input()

  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiTooltipContent="{ side: 'bottom' }"`. */
  readonly uiTooltipContent: StarInput<TooltipContentProps> = input(undefined, {
    transform: starInputs<TooltipContentProps>,
  })

  /** The part's state, as a signal. */
  readonly state = usePopupContent(
    inject(TooltipScope),
    "content",
    () =>
      withStar(this.uiTooltipContent(), {
        side: this.side(),
        align: this.align(),
        sideOffset: this.sideOffset(),
        alignOffset: this.alignOffset(),
        collisionPadding: this.collisionPadding(),
        arrowPadding: this.arrowPadding(),
        anchor: this.anchor(),
      }),
    {
      container: () => this.container() ?? this.uiTooltipContent()?.container,
    }
  ).state

  static ngTemplateContextGuard(
    _directive: TooltipContent,
    context: unknown
  ): context is { $implicit: TooltipContentState } {
    return true
  }
}

/**
 * An arrow on the tooltip's edge that points at its trigger.
 * @experimental
 */
@Directive({ selector: "[uiTooltipArrow]", exportAs: "uiTooltipArrow" })
class TooltipArrow {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(TooltipScope).handle, "arrow").state
}

/**
 * Shows the tooltip's shortcut, like ⌘S. Left empty, it shows the keys for this platform.
 * @experimental
 */
@Directive({ selector: "[uiTooltipShortcut]", exportAs: "uiTooltipShortcut" })
class TooltipShortcut {
  /** The keys to show. By default, the tooltip's `shortcut`. */
  readonly shortcut: InputSignal<TooltipShortcutProps["shortcut"]> = input()

  /** The shortcut's state, as a signal. */
  readonly state: Signal<TooltipShortcutState> = usePopupShortcut(
    TooltipScope,
    TooltipTriggerScope,
    this.shortcut
  )
}

export { createTooltipController } from "@ui-sdk/core/tooltip"
export type {
  TooltipApi,
  TooltipArrowState,
  TooltipContentProps,
  TooltipContentState,
  TooltipController,
  TooltipOpenChangeReason,
  TooltipOptions,
  TooltipPayloadChangeReason,
  TooltipPrimitive,
  TooltipShortcutProps,
  TooltipShortcutState,
  TooltipTriggerProps,
  TooltipTriggerState,
} from "@ui-sdk/core/tooltip"

export {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  type TooltipOpenChange,
  type TooltipPayloadChange,
  TooltipShortcut,
  TooltipTrigger,
}
