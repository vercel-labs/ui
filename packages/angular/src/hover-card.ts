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
  hoverCard,
  type HoverCardContentProps,
  type HoverCardContentState,
  type HoverCardOptions,
  type HoverCardTriggerProps,
  type HoverCardTriggerState,
} from "@ui-sdk/core/hover-card"
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
  usePopupContent,
  usePopupRoot,
  usePopupTrigger,
} from "./popup.ts"
import { usePart, usePrimitive, type PopupContainer } from "./use-primitive.ts"

/**
 * What `(beforeOpenChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type HoverCardOpenChange = Parameters<
  NonNullable<HoverCardOptions["onOpenChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<HoverCardOptions["onOpenChange"]>>[0]
}

/**
 * What `(beforePayloadChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type HoverCardPayloadChange = Parameters<
  NonNullable<HoverCardOptions["onPayloadChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<HoverCardOptions["onPayloadChange"]>>[0]
}

@Injectable()
class HoverCardScope extends PopupRoot<typeof hoverCard> {}

/**
 * A preview of what a link points to, shown when the pointer rests on the link or keyboard focus stays on it.
 * @experimental
 */
@Directive({
  selector: "[uiHoverCard]",
  exportAs: "uiHoverCard",
  providers: [HoverCardScope],
})
class HoverCard {
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Whether the card is open. Bind it with `[(open)]` to control the card. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** Whether the card starts open, when uncontrolled. */
  readonly defaultOpen = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly openChange = output<HoverCardOpenChange["value"]>()
  /** Runs when the card wants to open or close. `$event.cancel()` stops it. */
  readonly beforeOpenChange = output<HoverCardOpenChange>()
  /** Runs once the card has finished opening or closing, after any animation. */
  readonly openChangeComplete =
    output<
      Parameters<NonNullable<HoverCardOptions["onOpenChangeComplete"]>>[0]
    >()
  /** The new value, after a change that wasn't canceled. */
  readonly payloadChange = output<HoverCardPayloadChange["value"]>()
  /** Runs when the payload the content shows changes. `$event.cancel()` keeps the previous one. */
  readonly beforePayloadChange = output<HoverCardPayloadChange>()
  /** Milliseconds the pointer rests on the trigger, or keyboard focus stays on it, before the card opens. */
  readonly delay = input(undefined, { transform: optionalNumber })
  /** Milliseconds before the card closes once the pointer leaves the trigger and the card. */
  readonly closeDelay = input(undefined, { transform: optionalNumber })
  /** Stops the card from opening. The trigger keeps working as a link. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Opens, closes and inspects the card from anywhere, and connects triggers outside it. Create one with `createHoverCardController()`. */
  readonly controller: InputSignal<HoverCardOptions["controller"]> = input()
  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()

  readonly handle = usePrimitive(hoverCard, () => ({
    debug: this.debug(),
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    onOpenChange: emitChange(this.beforeOpenChange, this.openChange),
    onOpenChangeComplete: (value) => this.openChangeComplete.emit(value),
    onPayloadChange: emitChange(this.beforePayloadChange, this.payloadChange),
    delay: this.delay(),
    closeDelay: this.closeDelay(),
    disabled: this.disabled(),
    controller: this.controller(),
  }))

  constructor() {
    usePopupRoot(
      HoverCardScope,
      { handle: this.handle, container: this.container },
      () => this.controller()
    )
  }
}

/**
 * The link the card previews: pressing it follows the link, and hover or focus opens the card. A trigger outside the card connects through `controller`.
 * @experimental
 */
@Directive({ selector: "[uiHoverCardTrigger]", exportAs: "uiHoverCardTrigger" })
class HoverCardTrigger {
  /** Data for the content to render when this trigger opens the card, like the profile it links to. */
  readonly payload: InputSignal<HoverCardTriggerProps["payload"]> = input()

  /** Connects a trigger outside the hover card to the hover card with this controller. */
  readonly controller: InputSignal<HoverCardTriggerProps["controller"]> =
    input()

  readonly #part = usePopupTrigger(
    HoverCardScope,
    "trigger",
    () => ({
      payload: this.payload(),
    }),
    {
      controller: () => this.controller(),
      plain: () => ({}),
    }
  )
  /** The trigger's state, as a signal. */
  readonly state = computed<HoverCardTriggerState>(
    () => this.#part.state() ?? { open: false }
  )
}

/**
 * The card itself, positioned against its trigger. `*uiHoverCardContent` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiHoverCardContent]",
  exportAs: "uiHoverCardContent",
  providers: [PopupScope],
})
class HoverCardContent {
  /** Which side of the trigger the card opens on. */
  readonly side: InputSignal<HoverCardContentProps["side"]> = input()
  /** How the card lines up with the trigger along that side. */
  readonly align: InputSignal<HoverCardContentProps["align"]> = input()
  /** Gap between the trigger and the card, in pixels. */
  readonly sideOffset = input(undefined, { transform: optionalNumber })
  /** Shift along the trigger, in pixels. */
  readonly alignOffset = input(undefined, { transform: optionalNumber })
  /** Space to keep from the viewport edges, in pixels. */
  readonly collisionPadding = input(undefined, { transform: optionalNumber })
  /** Space to keep between the arrow and the popup's corners, in pixels. */
  readonly arrowPadding = input(undefined, { transform: optionalNumber })
  /** Positions the popup against this instead of its trigger: an element, a CSS selector, a point like `{ x, y }`, or anything with `getBoundingClientRect()`. It's read on every check, so it can move. A controller's `open({ anchor })` wins for that open. */
  readonly anchor: InputSignal<HoverCardContentProps["anchor"]> = input()
  /** Whether the card stays in the page, hidden, while closed. Its content keeps its state between opens. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiHoverCardContent="{ side: 'bottom' }"`. */
  readonly uiHoverCardContent: StarInput<HoverCardContentProps> = input(
    undefined,
    { transform: starInputs<HoverCardContentProps> }
  )

  /** The part's state, as a signal. */
  readonly state = usePopupContent(
    inject(HoverCardScope),
    "content",
    () =>
      withStar(this.uiHoverCardContent(), {
        side: this.side(),
        align: this.align(),
        sideOffset: this.sideOffset(),
        alignOffset: this.alignOffset(),
        collisionPadding: this.collisionPadding(),
        arrowPadding: this.arrowPadding(),
        anchor: this.anchor(),
        keepMounted: this.keepMounted(),
      }),
    {
      container: () => this.container() ?? this.uiHoverCardContent()?.container,
    }
  ).state

  static ngTemplateContextGuard(
    _directive: HoverCardContent,
    context: unknown
  ): context is { $implicit: HoverCardContentState } {
    return true
  }
}

/**
 * An arrow on the card's edge that points at its trigger.
 * @experimental
 */
@Directive({ selector: "[uiHoverCardArrow]", exportAs: "uiHoverCardArrow" })
class HoverCardArrow {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(HoverCardScope).handle, "arrow").state
}

export { createHoverCardController } from "@ui-sdk/core/hover-card"
export type {
  HoverCardApi,
  HoverCardArrowState,
  HoverCardContentProps,
  HoverCardContentState,
  HoverCardController,
  HoverCardOpenChangeReason,
  HoverCardOptions,
  HoverCardPayloadChangeReason,
  HoverCardPrimitive,
  HoverCardTriggerProps,
  HoverCardTriggerState,
} from "@ui-sdk/core/hover-card"

export {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  type HoverCardOpenChange,
  type HoverCardPayloadChange,
  HoverCardTrigger,
}
