import { Directive, input, output } from "@angular/core"
import {
  dialog,
  type DialogController,
  type DialogDismissAttemptDetails,
  type DialogOpenChangeDetails,
  type DialogPayloadChangeReason,
} from "@ui-sdk/core/dialog"
import { DialogScope } from "./dialog-parts.ts"
import { optionalBoolean } from "./inputs.ts"
import { emitChange, type Change } from "./outputs.ts"
import { usePopupRoot } from "./popup.ts"
import { usePrimitive, type PopupContainer } from "./use-primitive.ts"

/**
 * What `(beforeOpenChange)` emits: whether the dialog is about to open, why,
 * what closed it reported, and `cancel()` to leave it as it is.
 * @experimental
 */
type DialogOpenChange = DialogOpenChangeDetails & {
  /** Whether the dialog would be open. */
  value: boolean
}

/**
 * What `(beforePayloadChange)` emits: the payload the content is about to
 * show, why, and `cancel()` to keep the previous one.
 * @experimental
 */
type DialogPayloadChange = Change<unknown, DialogPayloadChangeReason>

const modalSetting = (value: unknown) =>
  value === "trap-focus" ? ("trap-focus" as const) : optionalBoolean(value)

/**
 * A window over the page that asks for the user's attention. Put its trigger,
 * backdrop and content inside. It has no element of its own, so it can sit on
 * an `<ng-container>`.
 * @experimental
 */
@Directive({
  selector: "[uiDialog]",
  exportAs: "uiDialog",
  providers: [DialogScope],
})
class Dialog {
  /** Whether the dialog is open. Bind it with `[(open)]` to control the dialog. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** Whether the dialog starts open, when uncontrolled. Focus moves into it once it's on the page. */
  readonly defaultOpen = input(undefined, { transform: optionalBoolean })
  /** `true`: the rest of the page is inert and doesn't scroll, focus is trapped, and an outside press only closes the dialog. `"trap-focus"`: traps focus, and leaves the page scrollable and clickable. `false`: a dialog beside the page, which Tab can leave and outside presses don't close. */
  readonly modal = input(undefined, { transform: modalSetting })
  /** Whether pressing outside the dialog, like on its backdrop, closes it. The press counts once it's released outside too. */
  readonly closeOnOutsidePress = input(undefined, {
    transform: optionalBoolean,
  })
  /** Whether Escape, an outside press, Android's back gesture and the screen reader's escape gesture can close the dialog. Close parts, triggers and the controller always can. */
  readonly dismissible = input(undefined, { transform: optionalBoolean })
  /** Elements that stay usable while the dialog makes the page inert. Elements, CSS selectors, or a function that returns elements, read when the dialog opens. */
  readonly persistentElements = input<
    (Element | string)[] | (() => Element[])
  >()
  /** What screen readers hear once a Close part's action has been running for a second. Set it in the page's language. An empty string says nothing. */
  readonly pendingAnnouncement = input<string>()
  /** How the dialog presents. `"sheet"` slides it up from the bottom of the screen, where it can be swiped away, and `"auto"` does that on small touch screens. */
  readonly presentation = input<"auto" | "dialog" | "sheet">()
  /** Opens, closes and inspects the dialog from anywhere, and connects triggers outside it. Create one with `createDialogController()`. */
  readonly controller = input<DialogController<any, any>>()
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Renders the dialog and its backdrop into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** Whether the dialog is open, after a change that wasn't canceled. */
  readonly openChange = output<boolean>()
  /** Runs before the dialog opens or closes, with the reason, what closed it reported and `cancel()`. */
  readonly beforeOpenChange = output<DialogOpenChange>()
  /** Runs once the dialog has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** The payload the content shows, after a change that wasn't canceled. */
  readonly payloadChange = output<unknown>()
  /** Runs before the payload the content shows changes, with the reason and `cancel()`. */
  readonly beforePayloadChange = output<DialogPayloadChange>()
  /** Runs when a dismissal was refused, because `dismissible` is false, an outside press doesn't close it, or a Close part's action is running. */
  readonly dismissAttempt = output<DialogDismissAttemptDetails>()

  readonly handle = usePrimitive(dialog, () => ({
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    modal: this.modal(),
    closeOnOutsidePress: this.closeOnOutsidePress(),
    presentation: this.presentation(),
    dismissible: this.dismissible(),
    debug: this.debug(),
    persistentElements: this.persistentElements(),
    pendingAnnouncement: this.pendingAnnouncement(),
    controller: this.controller(),
    onOpenChange: emitChange(this.beforeOpenChange, this.openChange),
    onOpenChangeComplete: (open) => this.openChangeComplete.emit(open),
    onPayloadChange: emitChange(this.beforePayloadChange, this.payloadChange),
    onDismissAttempt: (details) => this.dismissAttempt.emit(details),
  }))

  constructor() {
    usePopupRoot(
      DialogScope,
      { handle: this.handle, sheet: true, container: this.container },
      () => this.controller()
    )
  }
}

export { createDialogController } from "@ui-sdk/core/dialog"
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
  DialogApi,
  DialogBackdropState,
  DialogCloseActionDetails,
  DialogCloseProps,
  DialogCloseState,
  DialogContentProps,
  DialogContentState,
  DialogController,
  DialogDismissAttemptDetails,
  DialogDismissReason,
  DialogFinalFocus,
  DialogInitialFocus,
  DialogOpenChangeDetails,
  DialogOpenChangeReason,
  DialogOptions,
  DialogPayloadChangeReason,
  DialogPrimitive,
  DialogSharedOptions,
  DialogShortcutProps,
  DialogShortcutState,
  DialogTriggerProps,
  DialogTriggerState,
} from "@ui-sdk/core/dialog"

export {
  DialogBackdrop,
  DialogClose,
  type DialogCloseAction,
  DialogContent,
  DialogDescription,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "./dialog-parts.ts"

export { Dialog, type DialogOpenChange, type DialogPayloadChange }
