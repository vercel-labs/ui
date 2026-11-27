import {
  computed,
  Directive,
  inject,
  Injectable,
  input,
  type InputSignal,
  type Signal,
} from "@angular/core"
import type {
  AlertDialogController,
  dialog,
  DialogContentProps,
  DialogContentState,
  DialogController,
  DialogFinalFocus,
  DialogInitialFocus,
  DialogShortcutState,
  DialogTriggerState,
} from "@ui-sdk/core/dialog"
import {
  optionalBoolean,
  type StarInput,
  starInputs,
  withStar,
} from "./inputs.ts"
import { ActionEmitter, type Action } from "./outputs.ts"
import {
  plainButton,
  PopupRoot,
  PopupScope,
  PopupTriggerScope,
  usePopupContent,
  usePopupLayer,
  usePopupShortcut,
  usePopupTrigger,
} from "./popup.ts"
import { usePart, type PopupContainer } from "./use-primitive.ts"

// What a Dialog or an AlertDialog hands its parts. An alert dialog's slots
// and state are the dialog's, so one set of parts binds to either, and it
// never presents as a sheet.
@Injectable()
class DialogScope extends PopupRoot<typeof dialog> {
  sheet = true
}

@Injectable()
class DialogTriggerScope extends PopupTriggerScope<typeof dialog> {}

/**
 * What a Close part's `(action)` emits: the press, how it was made, and `waitUntil()`.
 * @experimental
 */
type DialogCloseAction = Action

/**
 * The button that opens the dialog. A trigger outside the dialog, like one
 * per table row, connects through `controller`, and is a plain button until
 * that dialog is on the page.
 * @experimental
 */
@Directive({
  selector: "[uiDialogTrigger], [uiAlertDialogTrigger]",
  exportAs: "uiDialogTrigger, uiAlertDialogTrigger",
  providers: [DialogTriggerScope],
})
class DialogTrigger {
  /** Stops the trigger from opening the dialog. A native button can't be focused or pressed, unless `focusableWhenDisabled` is set. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps a disabled trigger in the tab order with `aria-disabled` instead of the native attribute, so it can host a tooltip that says why. */
  readonly focusableWhenDisabled = input(undefined, {
    transform: optionalBoolean,
  })
  /** Data for the content to render when this trigger opens the dialog, like the row it belongs to. */
  readonly payload = input<unknown>()
  /** A keyboard shortcut that presses the trigger, like `"mod+k"`. `mod` is Command on Apple platforms and Control elsewhere. */
  readonly shortcut = input<string>()
  /** Connects a trigger outside the dialog to the dialog with this controller. */
  readonly controller = input<
    DialogController<any, any> | AlertDialogController<any, any>
  >()

  readonly #part = usePopupTrigger(
    DialogScope,
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
      inside: DialogTriggerScope,
      shortcut: this.shortcut,
    }
  )
  /** The trigger's state, as a signal. */
  readonly state = computed<DialogTriggerState>(
    () => this.#part.state() ?? { open: false, disabled: !!this.disabled() }
  )
}

/**
 * A layer between the page and the dialog, shown while it's open. Closed, it
 * stays in the page, hidden. `*uiDialogBackdrop` renders it only while the dialog is open.
 * @experimental
 */
@Directive({
  selector: "[uiDialogBackdrop], [uiAlertDialogBackdrop]",
  exportAs: "uiDialogBackdrop, uiAlertDialogBackdrop",
})
class DialogBackdrop {
  /** The backdrop's state, as a signal. */
  readonly state = usePopupLayer(inject(DialogScope), "backdrop").state

  static ngTemplateContextGuard(
    _directive: DialogBackdrop,
    context: unknown
  ): context is { $implicit: ReturnType<DialogBackdrop["state"]> } {
    return true
  }
}

/**
 * The dialog itself, named by its title and described by its description.
 * Closed, it stays in the page, hidden. `*uiDialogContent` renders it only
 * while the dialog is open, and `*uiDialogContent="let dialog"` reads its state.
 * @experimental
 */
@Directive({
  selector: "[uiDialogContent], [uiAlertDialogContent]",
  exportAs: "uiDialogContent, uiAlertDialogContent",
  providers: [PopupScope],
})
class DialogContent {
  /** Where focus goes when the dialog opens. Opening with touch focuses the dialog itself, so no on-screen keyboard appears. */
  readonly initialFocus = input<DialogInitialFocus>()
  /** Where focus goes when the dialog closes while focus is inside it. */
  readonly finalFocus: InputSignal<DialogFinalFocus | undefined> = input()
  /** Whether the `*` form keeps the dialog in the page, hidden, while closed. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })
  /** Renders the dialog and its backdrop where they are in the page instead of above it, so it can stay inside a frame, like an app preview. */
  readonly inline = input(undefined, { transform: optionalBoolean })
  /** Renders the dialog into this element instead of in place. The root's `container` does the same for its backdrop too. */
  readonly container = input<PopupContainer>()
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiDialogContent="{ inline: true }"`. */
  readonly uiDialogContent: StarInput<DialogContentProps> = input(undefined, {
    transform: starInputs<DialogContentProps>,
  })
  /** The same for an alert dialog: `*uiAlertDialogContent="{ inline: true }"`. */
  readonly uiAlertDialogContent: StarInput<DialogContentProps> = input(
    undefined,
    {
      transform: starInputs<DialogContentProps>,
    }
  )
  readonly #star = () => this.uiDialogContent() ?? this.uiAlertDialogContent()

  readonly #dialog = inject(DialogScope)
  /** The dialog's state, as a signal. */
  readonly state = usePopupContent(
    this.#dialog,
    "content",
    () =>
      withStar(this.#star(), {
        initialFocus: this.initialFocus(),
        finalFocus: this.finalFocus(),
        keepMounted: this.keepMounted(),
        inline: this.inline(),
      }),
    {
      container: () => this.container() ?? this.#star()?.container,
      inline: () => this.inline() ?? this.#star()?.inline,
      viewport: this.#dialog.sheet,
    }
  ).state

  static ngTemplateContextGuard(
    _directive: DialogContent,
    context: unknown
  ): context is { $implicit: DialogContentState } {
    return true
  }
}

/**
 * The dialog's name, which screen readers announce when it opens. Put it on a heading.
 * @experimental
 */
@Directive({
  selector: "[uiDialogTitle], [uiAlertDialogTitle]",
  exportAs: "uiDialogTitle, uiAlertDialogTitle",
})
class DialogTitle {
  /** The title's state, as a signal. */
  readonly state = usePart(inject(DialogScope).handle, "title").state
}

/**
 * Text that says more about the dialog, read after its title.
 * @experimental
 */
@Directive({
  selector: "[uiDialogDescription], [uiAlertDialogDescription]",
  exportAs: "uiDialogDescription, uiAlertDialogDescription",
})
class DialogDescription {
  /** The description's state, as a signal. */
  readonly state = usePart(inject(DialogScope).handle, "description").state
}

/**
 * A button that closes the dialog. With an `(action)` listener, the press
 * runs it first: pass a Promise to `$event.waitUntil()` to keep the dialog
 * open, and the button pending, until it settles.
 * @experimental
 */
@Directive({
  selector: "[uiDialogClose], [uiAlertDialogClose]",
  exportAs: "uiDialogClose, uiAlertDialogClose",
  outputs: ["action"],
})
class DialogClose {
  /** Reported as `returnValue` in `(beforeOpenChange)` and by the controller's `open()`. */
  readonly value = input<string>()
  /** Runs when the button is pressed, before the dialog closes. */
  readonly action = new ActionEmitter()
  /** The button's state, as a signal. */
  readonly state = usePart(inject(DialogScope).handle, "close", () => ({
    value: this.value(),
    action: this.action.handler(),
  })).state
}

/**
 * Shows a trigger's shortcut, like ⌘K, inside the trigger. Left empty, it
 * shows the keys for this platform. Screen readers skip it and hear the
 * trigger's `aria-keyshortcuts`.
 * @experimental
 */
@Directive({
  selector: "[uiDialogShortcut], [uiAlertDialogShortcut]",
  exportAs: "uiDialogShortcut, uiAlertDialogShortcut",
})
class DialogShortcut {
  /** The keys to show. Inside a trigger, its `shortcut`. */
  readonly shortcut = input<string>()

  /** The shortcut's state, as a signal. */
  readonly state: Signal<DialogShortcutState> = usePopupShortcut(
    DialogScope,
    DialogTriggerScope,
    this.shortcut
  )
}

export {
  DialogBackdrop,
  DialogClose,
  type DialogCloseAction,
  DialogContent,
  DialogDescription,
  DialogScope,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
}
