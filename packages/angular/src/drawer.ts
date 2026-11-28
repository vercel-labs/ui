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
import type { PropsOf } from "@ui-sdk/core"
import type { DialogTriggerState } from "@ui-sdk/core/dialog"
import {
  drawer,
  type DrawerContentProps,
  type DrawerContentState,
  type DrawerOptions,
  type DrawerOutletProps,
  type DrawerOutletState,
  type DrawerTriggerProps,
} from "@ui-sdk/core/drawer"
import {
  optionalBoolean,
  type StarInput,
  starInputs,
  withStar,
} from "./inputs.ts"
import { ActionEmitter, emitChange, type Action } from "./outputs.ts"
import {
  plainButton,
  PopupRoot,
  PopupScope,
  PopupTriggerScope,
  usePopupContent,
  usePopupLayer,
  usePopupRoot,
  usePopupShortcut,
  usePopupTrigger,
} from "./popup.ts"
import { usePart, usePrimitive, type PopupContainer } from "./use-primitive.ts"

/**
 * What `(beforeOpenChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type DrawerOpenChange = Parameters<
  NonNullable<DrawerOptions["onOpenChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<DrawerOptions["onOpenChange"]>>[0]
}

/**
 * What `(beforePayloadChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type DrawerPayloadChange = Parameters<
  NonNullable<DrawerOptions["onPayloadChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<DrawerOptions["onPayloadChange"]>>[0]
}

/**
 * What `(beforeSnapPointChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type DrawerSnapPointChange = Parameters<
  NonNullable<DrawerOptions["onSnapPointChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<DrawerOptions["onSnapPointChange"]>>[0]
}

/**
 * What `(action)` emits: the press, how it was made, and `waitUntil()`.
 * @experimental
 */
type DrawerCloseAction = Action

@Injectable()
class DrawerScope extends PopupRoot<typeof drawer> {}

@Injectable()
class DrawerTriggerScope extends PopupTriggerScope<typeof drawer> {}

/**
 * A dialog presented as a sheet that slides in from an edge. Put its trigger, backdrop and content inside.
 * @experimental
 */
@Directive({
  selector: "[uiDrawer]",
  exportAs: "uiDrawer",
  providers: [DrawerScope],
})
class Drawer {
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Whether the drawer is open. Bind it with `[(open)]` to control the drawer. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** Whether the drawer starts open, when uncontrolled. Focus moves into it once it's on the page. */
  readonly defaultOpen = input(undefined, { transform: optionalBoolean })
  /** Runs once the drawer has finished opening or closing, after any animation. */
  readonly openChangeComplete =
    output<Parameters<NonNullable<DrawerOptions["onOpenChangeComplete"]>>[0]>()
  /** Whether Escape, an outside press, a swipe, Android's back gesture and the screen reader's escape gesture can close the drawer. Close parts, triggers and the controller always can. */
  readonly dismissible = input(undefined, { transform: optionalBoolean })
  /** Runs when a dismissal was refused because `dismissible` is false, including a swipe. The drawer resists and springs back. */
  readonly dismissAttempt =
    output<Parameters<NonNullable<DrawerOptions["onDismissAttempt"]>>[0]>()
  /** Elements that stay usable while the drawer makes the page inert. Elements, CSS selectors, or a function that returns elements, read when the drawer opens. */
  readonly persistentElements: InputSignal<
    DrawerOptions["persistentElements"]
  > = input()
  /** What screen readers hear once a Close part's action has been running for a second. Set it in the page's language. An empty string says nothing. */
  readonly pendingAnnouncement: InputSignal<
    DrawerOptions["pendingAnnouncement"]
  > = input()
  /** The new value, after a change that wasn't canceled. */
  readonly openChange = output<DrawerOpenChange["value"]>()
  /** Runs when the drawer wants to open or close. `$event.reason` says why, `"swipe"` included, `$event.cancel()` stops it, and `$event.returnValue` carries what closed it. */
  readonly beforeOpenChange = output<DrawerOpenChange>()
  /** The new value, after a change that wasn't canceled. */
  readonly payloadChange = output<DrawerPayloadChange["value"]>()
  /** Runs when the payload the content shows changes. `$event.cancel()` keeps the previous payload. */
  readonly beforePayloadChange = output<DrawerPayloadChange>()
  /** `true`: the rest of the page is inert and doesn't scroll, focus is trapped, and an outside press only closes the drawer. `"trap-focus"`: traps focus and leaves the page usable. `false`: a drawer beside the page. See `modalAbove` to make it modal only above a snap point. */
  readonly modal: InputSignal<DrawerOptions["modal"]> = input()
  /** Whether pressing outside the drawer, like on its backdrop, closes it. */
  readonly closeOnOutsidePress = input(undefined, {
    transform: optionalBoolean,
  })
  /** Opens, closes and moves the drawer from anywhere, and connects triggers and outlets outside it. Create one with `createDrawerController()`. */
  readonly controller: InputSignal<DrawerOptions["controller"]> = input()
  /** Where the drawer can rest, from the edge it comes from: a fraction of the screen up to 1, pixels above 1, `"…px"`, `"…rem"`, `"…%"`, or `"content"` for its own size. */
  readonly snapPoints: InputSignal<DrawerOptions["snapPoints"]> = input()
  /** The snap point it rests on. Bind it with `[(snapPoint)]` to control it. */
  readonly snapPoint: InputSignal<DrawerOptions["snapPoint"]> = input()
  /** The snap point it opens at, when uncontrolled. It opens there again each time. */
  readonly defaultSnapPoint: InputSignal<DrawerOptions["defaultSnapPoint"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly snapPointChange = output<DrawerSnapPointChange["value"]>()
  /** Runs when the drawer moves to another snap point. `$event.reason` says why: a swipe, the handle, the keyboard, a resize or the controller. */
  readonly beforeSnapPointChange = output<DrawerSnapPointChange>()
  /** The edge it comes from. `"start"` and `"end"` follow the writing direction. */
  readonly side: InputSignal<DrawerOptions["side"]> = input()
  /** At or below this snap point the page stays usable and undimmed, like Maps. Above it, `modal` applies. */
  readonly modalAbove: InputSignal<DrawerOptions["modalAbove"]> = input()
  /** How it moves. `"pointer"` follows touch, mouse and pen with a spring fitted to iOS. `"scroll-snap"` uses the browser's own scrolling for bottom drawers. `"auto"` picks for the device. */
  readonly driver: InputSignal<DrawerOptions["driver"]> = input()
  /** Whether dragging toward a larger snap point on scrollable content moves the drawer first, until it's at its largest. */
  readonly expandOnScroll = input(undefined, { transform: optionalBoolean })
  /** Overrides the motion: spring, projection, rubber band and dim. Starts from `sheetPhysics.ios`. */
  readonly physics: InputSignal<DrawerOptions["physics"]> = input()
  /** Whether `<meta name="theme-color">` dims with the backdrop, so Safari's toolbars darken too. */
  readonly themeColor = input(undefined, { transform: optionalBoolean })
  /** Whether presses on the drawer near the screen's left and right edges are kept from starting iOS Safari's back and forward swipe. */
  readonly preventEdgeSwipe = input(undefined, { transform: optionalBoolean })
  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()

  readonly handle = usePrimitive(drawer, () => ({
    debug: this.debug(),
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    onOpenChangeComplete: (value) => this.openChangeComplete.emit(value),
    dismissible: this.dismissible(),
    onDismissAttempt: (value) => this.dismissAttempt.emit(value),
    persistentElements: this.persistentElements(),
    pendingAnnouncement: this.pendingAnnouncement(),
    onOpenChange: emitChange(this.beforeOpenChange, this.openChange),
    onPayloadChange: emitChange(this.beforePayloadChange, this.payloadChange),
    modal: this.modal(),
    closeOnOutsidePress: this.closeOnOutsidePress(),
    controller: this.controller(),
    snapPoints: this.snapPoints(),
    snapPoint: this.snapPoint(),
    defaultSnapPoint: this.defaultSnapPoint(),
    onSnapPointChange: emitChange(
      this.beforeSnapPointChange,
      this.snapPointChange
    ),
    side: this.side(),
    modalAbove: this.modalAbove(),
    driver: this.driver(),
    expandOnScroll: this.expandOnScroll(),
    physics: this.physics(),
    themeColor: this.themeColor(),
    preventEdgeSwipe: this.preventEdgeSwipe(),
  }))

  constructor() {
    usePopupRoot(
      DrawerScope,
      { handle: this.handle, container: this.container },
      () => this.controller()
    )
  }
}

/**
 * The button that opens the drawer. A trigger outside the drawer, like one per table row, connects through `controller`.
 * @experimental
 */
@Directive({
  selector: "[uiDrawerTrigger]",
  exportAs: "uiDrawerTrigger",
  providers: [DrawerTriggerScope],
})
class DrawerTrigger {
  /** Stops the trigger from opening the drawer. A native button can't be focused or pressed, unless `focusableWhenDisabled` is set. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps a disabled trigger in the tab order with `aria-disabled` instead of the native attribute, so it can host a tooltip that says why. Presses still do nothing. */
  readonly focusableWhenDisabled = input(undefined, {
    transform: optionalBoolean,
  })
  /** Data for the content to render when this trigger opens the drawer, like the row it belongs to. */
  readonly payload: InputSignal<DrawerTriggerProps["payload"]> = input()
  /** A keyboard shortcut that presses the trigger, like `"mod+k"`. `mod` is Command on Apple platforms and Control elsewhere. Sets `aria-keyshortcuts`, and a Shortcut part inside shows it. A modal drawer pauses the page's shortcuts while it's open. */
  readonly shortcut: InputSignal<DrawerTriggerProps["shortcut"]> = input()

  /** Connects a trigger outside the drawer to the drawer with this controller. */
  readonly controller: InputSignal<DrawerTriggerProps["controller"]> = input()

  readonly #part = usePopupTrigger(
    DrawerScope,
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
      inside: DrawerTriggerScope,
      shortcut: this.shortcut,
    }
  )
  /** The trigger's state, as a signal. */
  readonly state = computed<DialogTriggerState>(
    () => this.#part.state() ?? { open: false, disabled: !!this.disabled() }
  )
}

/**
 * The drawer's title, which names it. Put it on a heading.
 * @experimental
 */
@Directive({ selector: "[uiDrawerTitle]", exportAs: "uiDrawerTitle" })
class DrawerTitle {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(DrawerScope).handle, "title").state
}

/**
 * Text that describes the drawer while it's rendered.
 * @experimental
 */
@Directive({
  selector: "[uiDrawerDescription]",
  exportAs: "uiDrawerDescription",
})
class DrawerDescription {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(DrawerScope).handle, "description").state
}

/**
 * A button that closes the drawer. With an `(action)` listener, the press runs it first: pass a Promise to `$event.waitUntil()` to keep the drawer open, and the button pending, until it settles.
 * @experimental
 */
@Directive({
  selector: "[uiDrawerClose]",
  exportAs: "uiDrawerClose",
  outputs: ["action"],
})
class DrawerClose {
  /** Reported as `returnValue` in `(beforeOpenChange)` and by the controller's `open()`. */
  readonly value: InputSignal<PropsOf<typeof drawer, "close">["value"]> =
    input()
  /** Runs when the button is pressed, before the drawer closes. */
  readonly action = new ActionEmitter()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(DrawerScope).handle, "close", () => ({
    value: this.value(),
    action: this.action.handler(),
  })).state
}

/**
 * Shows a trigger's shortcut, like ⌘K, inside the trigger. Left empty, it shows the keys for this platform. Screen readers skip it and hear the trigger's `aria-keyshortcuts`.
 * @experimental
 */
@Directive({ selector: "[uiDrawerShortcut]", exportAs: "uiDrawerShortcut" })
class DrawerShortcut {
  /** The keys to show. Inside a trigger, its `shortcut`. */
  readonly shortcut: InputSignal<
    PropsOf<typeof drawer, "shortcut">["shortcut"]
  > = input()

  /** The shortcut's state, as a signal. */
  readonly state: Signal<{ text: string }> = usePopupShortcut(
    DrawerScope,
    DrawerTriggerScope,
    this.shortcut
  )
}

/**
 * A dim behind the drawer. Its opacity follows the drawer, so give it a color like `bg-black/20`. `*uiDrawerBackdrop` renders it only while it's shown.
 * @experimental
 */
@Directive({ selector: "[uiDrawerBackdrop]", exportAs: "uiDrawerBackdrop" })
class DrawerBackdrop {
  /** The part's state, as a signal. */
  readonly state = usePopupLayer(inject(DrawerScope), "backdrop").state

  static ngTemplateContextGuard(
    _directive: DrawerBackdrop,
    context: unknown
  ): context is { $implicit: ReturnType<DrawerBackdrop["state"]> } {
    return true
  }
}

/**
 * The sheet itself, a dialog, inside a full-screen viewport the drawer positions it in. `*uiDrawerContent` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiDrawerContent]",
  exportAs: "uiDrawerContent",
  providers: [PopupScope],
})
class DrawerContent {
  /** Where focus goes when the drawer opens. Opening with touch focuses the drawer itself, so no on-screen keyboard appears. */
  readonly initialFocus: InputSignal<DrawerContentProps["initialFocus"]> =
    input()
  /** Where focus goes when the drawer closes while focus is inside it. */
  readonly finalFocus: InputSignal<DrawerContentProps["finalFocus"]> = input()
  /** Whether the drawer stays in the page, hidden, while closed. Its content keeps its state between opens. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiDrawerContent="{ container: layer }"`. */
  readonly uiDrawerContent: StarInput<DrawerContentProps> = input(undefined, {
    transform: starInputs<DrawerContentProps>,
  })

  /** The part's state, as a signal. */
  readonly state = usePopupContent(
    inject(DrawerScope),
    "content",
    () =>
      withStar(this.uiDrawerContent(), {
        initialFocus: this.initialFocus(),
        finalFocus: this.finalFocus(),
        keepMounted: this.keepMounted(),
      }),
    {
      container: () => this.container() ?? this.uiDrawerContent()?.container,
      viewport: true,
    }
  ).state

  static ngTemplateContextGuard(
    _directive: DrawerContent,
    context: unknown
  ): context is { $implicit: DrawerContentState } {
    return true
  }
}

/**
 * The grabber. Pressing it moves to the next snap point; arrow keys, Home and End step.
 * @experimental
 */
@Directive({ selector: "[uiDrawerHandle]", exportAs: "uiDrawerHandle" })
class DrawerHandle {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(DrawerScope).handle, "handle").state
}

/**
 * An element that follows the drawer, like the page behind it. Outside the drawer, pass its `controller`.
 * @experimental
 */
@Directive({ selector: "[uiDrawerOutlet]", exportAs: "uiDrawerOutlet" })
class DrawerOutlet {
  /** Keyframes it plays as the drawer expands, like `{ scale: [1, 0.94] }`: the first while collapsed, the last at the largest snap point. They run on the compositor when they're transforms or opacity. */
  readonly keyframes: InputSignal<DrawerOutletProps["keyframes"]> = input()

  /** Connects an outlet outside the drawer to the drawer with this controller. */
  readonly controller: InputSignal<DrawerOutletProps["controller"]> = input()

  readonly #part = usePopupTrigger(
    DrawerScope,
    "outlet",
    () => ({
      keyframes: this.keyframes(),
    }),
    {
      controller: () => this.controller(),
      plain: () => ({}),
    }
  )
  /** The outlet's state, as a signal. */
  readonly state = computed<DrawerOutletState>(
    () => this.#part.state() ?? { open: false }
  )
}

export { createDrawerController, sheetPhysics } from "@ui-sdk/core/drawer"
export type {
  DrawerApi,
  DrawerBackdropState,
  DrawerContentProps,
  DrawerContentState,
  DrawerController,
  DrawerDismissAttemptDetails,
  DrawerDismissReason,
  DrawerDriver,
  DrawerHandleState,
  DrawerKeyframes,
  DrawerOpenChangeReason,
  DrawerOptions,
  DrawerOutletProps,
  DrawerOutletState,
  DrawerPayloadChangeReason,
  DrawerPrimitive,
  DrawerSide,
  DrawerSnapPointChangeReason,
  DrawerTriggerProps,
  SheetPhysics,
  SnapPoint,
} from "@ui-sdk/core/drawer"

export {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  type DrawerCloseAction,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  type DrawerOpenChange,
  DrawerOutlet,
  type DrawerPayloadChange,
  DrawerShortcut,
  type DrawerSnapPointChange,
  DrawerTitle,
  DrawerTrigger,
}
