import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  effect,
  ElementRef,
  HostAttributeToken,
  inject,
  input,
  type InputSignal,
  type Signal,
} from "@angular/core"
import type { ToastRegionInternalOptions } from "@ui-sdk/core/renderer"
import {
  createToaster as createCoreToaster,
  toast as coreToast,
  toastRegion,
  type Toast as ToastData,
  type Toaster,
  type ToastItem,
  type ToastRegionOptions,
  type ToastRegionState,
  type ToastState,
} from "@ui-sdk/core/toast"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { ActionEmitter } from "./outputs.ts"
import {
  HostedRegion,
  ToastList,
  ToastRegionContext,
  useContent,
  type ToastContent,
} from "./toast-context.ts"
import {
  Renders,
  useId,
  usePart,
  usePrimitive,
  type PopupContainer,
} from "./use-primitive.ts"

/**
 * Shows a toast from anywhere: `toast("Saved")`, `toast.success(...)`,
 * `toast.promise(save(), { loading, success, error })`. Content is text or a template.
 * @experimental
 */
const toast = coreToast as Toaster<ToastContent>

/**
 * Creates a queue of toasts and the function that adds to it, for a second
 * region with its own toasts. Pass it to that region as `toaster`.
 * @experimental
 */
const createToaster = createCoreToaster as <Content = ToastContent>(
  options?: Parameters<typeof createCoreToaster>[0]
) => Toaster<Content>

/**
 * One toast, on an element inside the region: `<li [uiToast]="item.toast">`.
 * Swipe it toward the region's side, or press Escape on it, to dismiss it.
 * @experimental
 */
@Directive({ selector: "[uiToast]", exportAs: "uiToast" })
class Toast {
  /** The toast it shows, from the region's `state().toasts`. */
  readonly uiToast = input.required<ToastData<ToastContent>>()

  /** The toast's state, as a signal. */
  readonly state = usePart(inject(ToastRegionContext), "root", () => ({
    id: this.uiToast().id,
  })).state

  static ngTemplateContextGuard(
    _directive: Toast,
    context: unknown
  ): context is { $implicit: ToastState } {
    return true
  }
}

/**
 * The toast's title. Left empty, it shows the toast's `title`, and hides when the toast has none.
 * @experimental
 */
@Directive({ selector: "[uiToastTitle]", exportAs: "uiToastTitle" })
class ToastTitle {
  constructor() {
    const { uiToast } = inject(Toast)
    usePart(inject(ToastRegionContext), "title", () => ({ id: uiToast().id }))
    useContent(
      () => uiToast().title,
      (own) => own || uiToast().title != null
    )
  }
}

/**
 * The toast's description. Left empty, it shows the toast's `description`, and hides when the toast has none.
 * @experimental
 */
@Directive({
  selector: "[uiToastDescription]",
  exportAs: "uiToastDescription",
})
class ToastDescription {
  constructor() {
    const { uiToast } = inject(Toast)
    usePart(inject(ToastRegionContext), "description", () => ({
      id: uiToast().id,
    }))
    useContent(
      () => uiToast().description,
      (own) => own || uiToast().description != null
    )
  }
}

/**
 * The toast's action, like Undo. Left empty, it shows the toast's `action` label. It hides when the toast
 * has no action and nothing listens to `(action)`. For an action with an `href`, put it on an `<a>` with that `href`.
 * @experimental
 */
@Directive({
  selector: "[uiToastAction]",
  exportAs: "uiToastAction",
  outputs: ["action"],
})
class ToastAction {
  /** Runs when it's pressed, instead of the toast's own `action.onAction`. `$event.waitUntil(promise)` marks it pending. */
  readonly action = new ActionEmitter()
  /** Whether pressing it dismisses the toast. */
  readonly dismiss = input(undefined, { transform: optionalBoolean })

  readonly #toast = inject(Toast).uiToast
  readonly #id = useId()
  /** The button's state, as a signal. */
  readonly state = usePart(inject(ToastRegionContext), "action", () => ({
    id: this.#id,
    toast: this.#toast().id,
    // Given here, the toast's own action runs in Angular's zone too.
    onAction: this.action.handler() ?? this.#toast().action?.onAction,
    dismiss: this.dismiss(),
  })).state

  constructor() {
    useContent(
      () => this.#toast().action?.label,
      () => !!this.#toast().action || this.action.listened()
    )
  }
}

/**
 * Closes the toast. Left empty, it shows the toast's `cancel` label. `(action)` runs first, and
 * `$event.waitUntil(promise)` keeps the toast open until the Promise settles.
 * @experimental
 */
@Directive({
  selector: "[uiToastClose]",
  exportAs: "uiToastClose",
  outputs: ["action"],
})
class ToastClose {
  /** Runs before the toast closes. `$event.waitUntil(promise)` keeps it open and the button pending until the Promise settles. */
  readonly action = new ActionEmitter()

  readonly #toast = inject(Toast).uiToast
  readonly #id = useId()
  /** The button's state, as a signal. */
  readonly state = usePart(inject(ToastRegionContext), "close", () => ({
    id: this.#id,
    toast: this.#toast().id,
    action: this.action.handler(),
  })).state

  constructor() {
    useContent(() => this.#toast().cancel?.label)
  }
}

/**
 * Shows a toaster's toasts. Place it once, on a `<section>`. Left empty, each toast shows its title,
 * description, action and cancel button. To render your own, loop over `state().toasts` inside it.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiToastRegion]",
  exportAs: "uiToastRegion",
  imports: [
    Toast,
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastList,
    ToastTitle,
  ],
  providers: [
    {
      provide: ToastRegionContext,
      useFactory: () => inject(ToastRegion).handle,
    },
  ],
  template: `
    <ol uiToastList>
      <ng-content>
        @for (item of state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <div>
              <div uiToastTitle></div>
              <div uiToastDescription></div>
            </div>
            @if (item.toast.action; as action) {
              @if (action.href) {
                <a uiToastAction [href]="action.href"></a>
              } @else {
                <button uiToastAction type="button"></button>
              }
            }
            @if (item.toast.cancel; as cancel) {
              <button
                uiToastClose
                type="button"
                (action)="cancel.onCancel?.($event.event, $event)"
              ></button>
            }
          </li>
        }
      </ng-content>
    </ol>
  `,
})
class ToastRegion {
  /** The queue it shows. A second toaster, from `createToaster()`, gives a second region its own toasts. */
  readonly toaster: InputSignal<ToastRegionOptions["toaster"]> = input()
  /** The edge of the viewport it sits on. Swiping toward it dismisses a toast. */
  readonly side: InputSignal<ToastRegionOptions["side"]> = input()
  /** Where along that edge. `"start"` and `"end"` follow the writing direction, and swiping toward them dismisses too. */
  readonly align: InputSignal<ToastRegionOptions["align"]> = input()
  /** How many toasts show at once. Older ones wait, with their timers stopped, until there's room. */
  readonly maxVisible = input(undefined, { transform: optionalNumber })
  /** Whether the stack is always expanded. Otherwise it expands while the pointer or focus is in it. */
  readonly expanded = input(undefined, { transform: optionalBoolean })
  /** The key that moves focus into the region and back, like `"F6"` or `"alt+t"`. `null` turns it off. */
  readonly shortcut: InputSignal<ToastRegionOptions["shortcut"]> = input()
  /** What screen readers hear once a toast's action or close button has been pending for a second. Set it in the page's language. An empty string says nothing. */
  readonly pendingAnnouncement = input<string>()
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Where the region renders. Without top layer support, the body. */
  readonly container = input<PopupContainer>()

  readonly #placed = !inject(HostedRegion, { optional: true })
  readonly #label =
    inject(new HostAttributeToken("aria-label"), { optional: true }) ??
    undefined
  readonly handle = usePrimitive(
    toastRegion,
    () =>
      ({
        toaster: this.toaster(),
        side: this.side(),
        align: this.align(),
        maxVisible: this.maxVisible(),
        expanded: this.expanded(),
        shortcut: this.shortcut(),
        pendingAnnouncement: this.pendingAnnouncement(),
        debug: this.debug(),
        placed: this.#placed,
        label: this.#label,
      }) satisfies ToastRegionInternalOptions
  )
  /** The region's state, as a signal. Its `toasts` are the ones to render, newest first. */
  readonly state = usePart(this.handle, "region", undefined, {
    portal: () => this.container(),
  }).state as Signal<
    Omit<ToastRegionState, "toasts"> & {
      toasts: readonly ToastItem<ToastContent>[]
    }
  >

  constructor() {
    // The region has its name only while it holds toasts, so the author's leaves the element for core to set.
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.removeAttribute(
      "aria-label"
    )
    // A toast renders in the task that showed it, so the region's shortcut reaches it right away.
    const renders = inject(Renders)
    let count = 0
    effect((onCleanup) => {
      const { instance } = this.handle
      onCleanup(
        instance.subscribe(() => {
          const next = instance.get().items.length
          if (next !== count) {
            count = next
            renders.soon()
          }
        })
      )
    })
  }
}

// Core's `Toast` and `ToastAction` types end in `Data` here, since the directives have their names.
export type {
  Toast as ToastData,
  ToastAction as ToastActionData,
  ToastActionDetails,
  ToastActionProps,
  ToastButtonState,
  ToastCancel,
  ToastCloseProps,
  ToastDismissDetails,
  ToastDismissReason,
  Toaster,
  ToastItem,
  ToastOptions,
  ToastPauseReason,
  ToastRegionOptions,
  ToastRegionPrimitive,
  ToastRegionState,
  ToastState,
  ToastType,
} from "@ui-sdk/core/toast"
export type { ToastContent } from "./toast-context.ts"

export {
  createToaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  toast,
  ToastRegion,
  ToastTitle,
}
