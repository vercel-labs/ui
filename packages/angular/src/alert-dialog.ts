import { Directive, input, output } from "@angular/core"
import {
  alertDialog,
  type AlertDialogController,
  type AlertDialogOpenChangeReason,
  type AlertDialogPayloadChangeReason,
} from "@ui-sdk/core/alert-dialog"
import type {
  dialog,
  DialogController,
  DialogDismissAttemptDetails,
  DialogOpenChangeDetails,
} from "@ui-sdk/core/dialog"
import { DialogScope } from "./dialog-parts.ts"
import { optionalBoolean } from "./inputs.ts"
import { emitChange, type Change } from "./outputs.ts"
import { usePopupRoot } from "./popup.ts"
import { usePrimitive, type PopupContainer } from "./use-primitive.ts"

/**
 * What `(beforeOpenChange)` emits: whether the alert dialog is about to open,
 * why, the `value` of the Close part that closed it, and `cancel()` to leave it as it is.
 * @experimental
 */
type AlertDialogOpenChange =
  DialogOpenChangeDetails<AlertDialogOpenChangeReason> & {
    /** Whether the alert dialog would be open. */
    value: boolean
  }

/**
 * What `(beforePayloadChange)` emits: the payload the content is about to
 * show, why, and `cancel()` to keep the previous one.
 * @experimental
 */
type AlertDialogPayloadChange = Change<unknown, AlertDialogPayloadChangeReason>

/**
 * A modal dialog that interrupts the user with something important and waits
 * for an answer. It takes none of the inputs only Dialog has, like `modal`:
 * an alert dialog is always modal and never a sheet. It has no element of its
 * own, so it can sit on an `<ng-container>`.
 * @experimental
 */
@Directive({
  selector: "[uiAlertDialog]",
  exportAs: "uiAlertDialog",
  providers: [DialogScope],
})
class AlertDialog {
  /** Whether the alert dialog is open. Bind it with `[(open)]` to control the alert dialog. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** Whether the alert dialog starts open, when uncontrolled. Focus moves into it once it's on the page. */
  readonly defaultOpen = input(undefined, { transform: optionalBoolean })
  /** Whether Escape, Android's back gesture and the screen reader's escape gesture can close the alert dialog. Close parts, triggers and the controller always can. */
  readonly dismissible = input(undefined, { transform: optionalBoolean })
  /** Elements that stay usable while the alert dialog makes the page inert. Elements, CSS selectors, or a function that returns elements, read when it opens. */
  readonly persistentElements = input<
    (Element | string)[] | (() => Element[])
  >()
  /** What screen readers hear once a Close part's action has been running for a second. Set it in the page's language. An empty string says nothing. */
  readonly pendingAnnouncement = input<string>()
  /** Opens, closes and inspects the alert dialog from anywhere, and connects triggers outside it. Create one with `createAlertDialogController()` or `createConfirm()`. */
  readonly controller = input<AlertDialogController<any, any>>()
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Renders the alert dialog and its backdrop into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** Whether the alert dialog is open, after a change that wasn't canceled. */
  readonly openChange = output<boolean>()
  /** Runs before the alert dialog opens or closes, with the reason, the `value` of the Close part that closed it and `cancel()`. */
  readonly beforeOpenChange = output<AlertDialogOpenChange>()
  /** Runs once the alert dialog has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** The payload the content shows, after a change that wasn't canceled. */
  readonly payloadChange = output<unknown>()
  /** Runs before the payload the content shows changes, with the reason and `cancel()`. */
  readonly beforePayloadChange = output<AlertDialogPayloadChange>()
  /** Runs when a dismissal was refused, because `dismissible` is false or a Close part's action is running. */
  readonly dismissAttempt = output<DialogDismissAttemptDetails>()

  // The alert dialog's slots and state are the dialog's, so the parts bind to it as one.
  readonly handle = usePrimitive(
    alertDialog as unknown as typeof dialog,
    () => ({
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      dismissible: this.dismissible(),
      persistentElements: this.persistentElements(),
      pendingAnnouncement: this.pendingAnnouncement(),
      controller: this.controller() as DialogController<any, any> | undefined,
      debug: this.debug(),
      onOpenChange: emitChange(this.beforeOpenChange as never, this.openChange),
      onOpenChangeComplete: (open) => this.openChangeComplete.emit(open),
      onPayloadChange: emitChange(
        this.beforePayloadChange as never,
        this.payloadChange
      ),
      onDismissAttempt: (details) => this.dismissAttempt.emit(details),
    })
  )

  constructor() {
    usePopupRoot(
      DialogScope,
      { handle: this.handle, sheet: false, container: this.container },
      () => this.controller()
    )
  }
}

export {
  confirm,
  createAlertDialogController,
  createConfirm,
} from "@ui-sdk/core/alert-dialog"
export type {
  AlertDialogBackdropState,
  AlertDialogCloseActionDetails,
  AlertDialogCloseProps,
  AlertDialogCloseState,
  AlertDialogContentProps,
  AlertDialogContentState,
  AlertDialogController,
  AlertDialogOpenChangeReason,
  AlertDialogOptions,
  AlertDialogPayloadChangeReason,
  AlertDialogPrimitive,
  AlertDialogShortcutProps,
  AlertDialogShortcutState,
  AlertDialogTriggerProps,
  AlertDialogTriggerState,
  ConfirmEntry,
  ConfirmOptions,
} from "@ui-sdk/core/alert-dialog"

// The parts are Dialog's: the alert dialog's slots and state are the dialog's.
export {
  DialogBackdrop as AlertDialogBackdrop,
  DialogClose as AlertDialogClose,
  type DialogCloseAction as AlertDialogCloseAction,
  DialogContent as AlertDialogContent,
  DialogDescription as AlertDialogDescription,
  DialogShortcut as AlertDialogShortcut,
  DialogTitle as AlertDialogTitle,
  DialogTrigger as AlertDialogTrigger,
} from "./dialog-parts.ts"

export {
  AlertDialog,
  type AlertDialogOpenChange,
  type AlertDialogPayloadChange,
}
