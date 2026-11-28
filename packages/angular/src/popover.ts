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
  popover,
  type PopoverContentProps,
  type PopoverContentState,
  type PopoverOptions,
  type PopoverShortcutProps,
  type PopoverShortcutState,
  type PopoverTriggerProps,
  type PopoverTriggerState,
} from "@ui-sdk/core/popover"
import {
  optionalBoolean,
  optionalNumber,
  type StarInput,
  starInputs,
  withStar,
} from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import {
  plainButton,
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
type PopoverOpenChange = Parameters<
  NonNullable<PopoverOptions["onOpenChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<PopoverOptions["onOpenChange"]>>[0]
}

/**
 * What `(beforePayloadChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type PopoverPayloadChange = Parameters<
  NonNullable<PopoverOptions["onPayloadChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<PopoverOptions["onPayloadChange"]>>[0]
}

@Injectable()
class PopoverScope extends PopupRoot<typeof popover> {}

@Injectable()
class PopoverTriggerScope extends PopupTriggerScope<typeof popover> {}

/**
 * Rich content in a floating panel, opened from a button. Put its trigger and content inside.
 * @experimental
 */
@Directive({
  selector: "[uiPopover]",
  exportAs: "uiPopover",
  providers: [PopoverScope],
})
class Popover {
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Whether the popover is open. Bind it with `[(open)]` to control the popover. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** Whether the popover starts open, when uncontrolled. */
  readonly defaultOpen = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly openChange = output<PopoverOpenChange["value"]>()
  /** Runs when the popover wants to open or close. `$event.cancel()` stops it. */
  readonly beforeOpenChange = output<PopoverOpenChange>()
  /** Runs once the popover has finished opening or closing, after any animation. */
  readonly openChangeComplete =
    output<Parameters<NonNullable<PopoverOptions["onOpenChangeComplete"]>>[0]>()
  /** The new value, after a change that wasn't canceled. */
  readonly payloadChange = output<PopoverPayloadChange["value"]>()
  /** Runs when the payload the content shows changes. `$event.cancel()` keeps the previous one. */
  readonly beforePayloadChange = output<PopoverPayloadChange>()
  /** `false` keeps the page usable, `true` traps focus and makes the page inert, `"trap-focus"` only traps focus. */
  readonly modal: InputSignal<PopoverOptions["modal"]> = input()
  /** Whether resting the pointer on the trigger opens the popover. */
  readonly openOnHover = input(undefined, { transform: optionalBoolean })
  /** Milliseconds the pointer rests on the trigger before the popover opens, with `openOnHover`. */
  readonly delay = input(undefined, { transform: optionalNumber })
  /** Milliseconds before the popover closes once the pointer leaves it, with `openOnHover`. */
  readonly closeDelay = input(undefined, { transform: optionalNumber })
  /** How the popover presents: a popover, a sheet, or `"auto"` for a sheet on small touch screens. */
  readonly presentation: InputSignal<PopoverOptions["presentation"]> = input()
  /** Opens, closes and inspects the popover from anywhere. Create one with `createPopoverController()`. */
  readonly controller: InputSignal<PopoverOptions["controller"]> = input()
  /** Whether Escape, an outside press, focus or the window leaving, Android's back gesture, the screen reader's escape gesture and a swipe on a sheet can close the popover. Triggers, Close parts and the controller always can. */
  readonly dismissible = input(undefined, { transform: optionalBoolean })
  /** Runs when `dismissible` refused a dismissal made on purpose: Escape, an outside press, back, the screen reader's escape or a swipe. Focus or the window leaving is refused without it. */
  readonly dismissAttempt =
    output<Parameters<NonNullable<PopoverOptions["onDismissAttempt"]>>[0]>()
  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()

  readonly handle = usePrimitive(popover, () => ({
    debug: this.debug(),
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    onOpenChange: emitChange(this.beforeOpenChange, this.openChange),
    onOpenChangeComplete: (value) => this.openChangeComplete.emit(value),
    onPayloadChange: emitChange(this.beforePayloadChange, this.payloadChange),
    modal: this.modal(),
    openOnHover: this.openOnHover(),
    delay: this.delay(),
    closeDelay: this.closeDelay(),
    presentation: this.presentation(),
    controller: this.controller(),
    dismissible: this.dismissible(),
    onDismissAttempt: (value) => this.dismissAttempt.emit(value),
  }))

  constructor() {
    usePopupRoot(
      PopoverScope,
      { handle: this.handle, container: this.container },
      () => this.controller()
    )
  }
}

/**
 * The button that opens the popover. A trigger outside the popover connects through `controller`.
 * @experimental
 */
@Directive({
  selector: "[uiPopoverTrigger]",
  exportAs: "uiPopoverTrigger",
  providers: [PopoverTriggerScope],
})
class PopoverTrigger {
  /** Stops the trigger from opening the popover. A native button can't be focused or pressed, unless `focusableWhenDisabled` is set. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps a disabled trigger in the tab order with `aria-disabled` instead of the native attribute, so it can host a tooltip that says why. Presses still do nothing. */
  readonly focusableWhenDisabled = input(undefined, {
    transform: optionalBoolean,
  })
  /** Data for the content to render when this trigger opens the popover, like the row it belongs to. */
  readonly payload: InputSignal<PopoverTriggerProps["payload"]> = input()
  /** A keyboard shortcut that presses the trigger, like `"mod+i"`. `mod` is Command on Apple platforms and Control elsewhere. Sets `aria-keyshortcuts`. */
  readonly shortcut: InputSignal<PopoverTriggerProps["shortcut"]> = input()

  /** Connects a trigger outside the popover to the popover with this controller. */
  readonly controller: InputSignal<PopoverTriggerProps["controller"]> = input()

  readonly #part = usePopupTrigger(
    PopoverScope,
    "trigger",
    () => ({
      disabled: this.disabled(),
      focusableWhenDisabled: this.focusableWhenDisabled(),
      payload: this.payload(),
      shortcut: this.shortcut(),
    }),
    {
      controller: () => this.controller(),
      plain: plainButton(this.disabled, this.focusableWhenDisabled),
      inside: PopoverTriggerScope,
      shortcut: this.shortcut,
    }
  )
  /** The trigger's state, as a signal. */
  readonly state = computed<PopoverTriggerState>(
    () => this.#part.state() ?? { open: false, disabled: !!this.disabled() }
  )
}

/**
 * The panel itself, positioned against its trigger, named by its title and described by its description. `*uiPopoverContent` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiPopoverContent]",
  exportAs: "uiPopoverContent",
  providers: [PopupScope],
})
class PopoverContent {
  /** Which side of the trigger the popover opens on. */
  readonly side: InputSignal<PopoverContentProps["side"]> = input()
  /** How the popover lines up with the trigger along that side. */
  readonly align: InputSignal<PopoverContentProps["align"]> = input()
  /** Gap between the trigger and the popover, in pixels. */
  readonly sideOffset = input(undefined, { transform: optionalNumber })
  /** Shift along the trigger, in pixels. */
  readonly alignOffset = input(undefined, { transform: optionalNumber })
  /** Space to keep from the viewport edges, in pixels. */
  readonly collisionPadding = input(undefined, { transform: optionalNumber })
  /** Space to keep between the arrow and the popup's corners, in pixels. */
  readonly arrowPadding = input(undefined, { transform: optionalNumber })
  /** Positions the popup against this instead of its trigger: an element, a CSS selector, a point like `{ x, y }`, or anything with `getBoundingClientRect()`. It's read on every check, so it can move. A controller's `open({ anchor })` wins for that open. */
  readonly anchor: InputSignal<PopoverContentProps["anchor"]> = input()
  /** Where focus goes when the popover opens. Opening on hover never moves focus, and opening with touch focuses the popover itself so no on-screen keyboard appears. */
  readonly initialFocus: InputSignal<PopoverContentProps["initialFocus"]> =
    input()
  /** Where focus goes when the popover closes while focus is inside it. */
  readonly finalFocus: InputSignal<PopoverContentProps["finalFocus"]> = input()
  /** Whether the popover stays in the page, hidden, while closed. Its content keeps its state between opens. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })
  /** Renders the popover where it is in the page instead of above it, inside its parent's layout and stacking, and leaves placing it to your CSS: `side`, `align` and the offsets don't apply. */
  readonly inline = input(undefined, { transform: optionalBoolean })

  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiPopoverContent="{ side: 'bottom' }"`. */
  readonly uiPopoverContent: StarInput<PopoverContentProps> = input(undefined, {
    transform: starInputs<PopoverContentProps>,
  })

  /** The part's state, as a signal. */
  readonly state = usePopupContent(
    inject(PopoverScope),
    "content",
    () =>
      withStar(this.uiPopoverContent(), {
        side: this.side(),
        align: this.align(),
        sideOffset: this.sideOffset(),
        alignOffset: this.alignOffset(),
        collisionPadding: this.collisionPadding(),
        arrowPadding: this.arrowPadding(),
        anchor: this.anchor(),
        initialFocus: this.initialFocus(),
        finalFocus: this.finalFocus(),
        keepMounted: this.keepMounted(),
        inline: this.inline(),
      }),
    {
      container: () => this.container() ?? this.uiPopoverContent()?.container,
      inline: () => this.inline() ?? this.uiPopoverContent()?.inline,
      viewport: true,
    }
  ).state

  static ngTemplateContextGuard(
    _directive: PopoverContent,
    context: unknown
  ): context is { $implicit: PopoverContentState } {
    return true
  }
}

/**
 * The popover's title, which names it. Put it on a heading.
 * @experimental
 */
@Directive({ selector: "[uiPopoverTitle]", exportAs: "uiPopoverTitle" })
class PopoverTitle {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(PopoverScope).handle, "title").state
}

/**
 * Text that describes the popover while it's rendered.
 * @experimental
 */
@Directive({
  selector: "[uiPopoverDescription]",
  exportAs: "uiPopoverDescription",
})
class PopoverDescription {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(PopoverScope).handle, "description").state
}

/**
 * A button that closes the popover.
 * @experimental
 */
@Directive({ selector: "[uiPopoverClose]", exportAs: "uiPopoverClose" })
class PopoverClose {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(PopoverScope).handle, "close").state
}

/**
 * An arrow on the panel's edge that points at its trigger.
 * @experimental
 */
@Directive({ selector: "[uiPopoverArrow]", exportAs: "uiPopoverArrow" })
class PopoverArrow {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(PopoverScope).handle, "arrow").state
}

/**
 * Shows a trigger's shortcut, like ⌘I, inside the trigger. Left empty, it shows the keys for this platform. Screen readers skip it and hear the trigger's `aria-keyshortcuts`.
 * @experimental
 */
@Directive({ selector: "[uiPopoverShortcut]", exportAs: "uiPopoverShortcut" })
class PopoverShortcut {
  /** The keys to show. Inside a trigger, its `shortcut`. */
  readonly shortcut: InputSignal<PopoverShortcutProps["shortcut"]> = input()

  /** The shortcut's state, as a signal. */
  readonly state: Signal<PopoverShortcutState> = usePopupShortcut(
    PopoverScope,
    PopoverTriggerScope,
    this.shortcut
  )
}

export { createPopoverController } from "@ui-sdk/core/popover"
export type {
  PopoverApi,
  PopoverArrowState,
  PopoverContentProps,
  PopoverContentState,
  PopoverController,
  PopoverDismissReason,
  PopoverFinalFocus,
  PopoverInitialFocus,
  PopoverOpenChangeReason,
  PopoverOptions,
  PopoverPayloadChangeReason,
  PopoverPrimitive,
  PopoverShortcutProps,
  PopoverShortcutState,
  PopoverTriggerProps,
  PopoverTriggerState,
} from "@ui-sdk/core/popover"

export {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  type PopoverOpenChange,
  type PopoverPayloadChange,
  PopoverShortcut,
  PopoverTitle,
  PopoverTrigger,
}
