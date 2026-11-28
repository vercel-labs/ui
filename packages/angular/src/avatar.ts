import { Directive, inject, input, output } from "@angular/core"
import {
  avatar,
  type AvatarFallbackProps,
  type AvatarOptions,
} from "@ui-sdk/core/avatar"
import {
  optionalBoolean,
  optionalNumber,
  type StarInput,
  starInputs,
  withStar,
} from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeLoadingStatusChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type AvatarLoadingStatusChange = Parameters<
  NonNullable<AvatarOptions["onLoadingStatusChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<AvatarOptions["onLoadingStatusChange"]>>[0]
}

/**
 * The root: a box for the image and its fallback.
 * @experimental
 */
@Directive({ selector: "[uiAvatar]", exportAs: "uiAvatar" })
class Avatar {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly loadingStatusChange = output<AvatarLoadingStatusChange["value"]>()
  /** Runs when the image's loading status changes: `"loading"` when it gets a source, `"loaded"`, `"error"`, and `"idle"` when it leaves the page. `$event.reason` says why, and `$event.event` is the image's `load` or `error` event, or undefined when the status was known at once, like for a cached image. */
  readonly beforeLoadingStatusChange = output<AvatarLoadingStatusChange>()

  readonly handle = usePrimitive(avatar, () => ({
    debug: this.debug(),
    onLoadingStatusChange: emitChange(
      this.beforeLoadingStatusChange,
      this.loadingStatusChange
    ),
  }))
  /** The avatar's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * A real <img>, hidden until it loads. Every image attribute passes through, like `crossorigin`, `referrerpolicy`, `srcset` and `sizes`.
 * @experimental
 */
@Directive({ selector: "[uiAvatarImage]", exportAs: "uiAvatarImage" })
class AvatarImage {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Avatar).handle, "image").state
}

/**
 * Shown while there's no loaded image, after its `delay`. `*uiAvatarFallback` renders it only while it's shown.
 * @experimental
 */
@Directive({ selector: "[uiAvatarFallback]", exportAs: "uiAvatarFallback" })
class AvatarFallback {
  /** How long to wait, in milliseconds, before showing the fallback, so a fast image appears without the fallback flashing first. Without one, the fallback shows at once, server markup included. */
  readonly delay = input(undefined, { transform: optionalNumber })
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiAvatarFallback="{ delay: 600 }"`. */
  readonly uiAvatarFallback: StarInput<AvatarFallbackProps> = input(undefined, {
    transform: starInputs<AvatarFallbackProps>,
  })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Avatar).handle, "fallback", () =>
    withStar(this.uiAvatarFallback(), { delay: this.delay() })
  ).state

  static ngTemplateContextGuard(
    _directive: AvatarFallback,
    context: unknown
  ): context is { $implicit: ReturnType<AvatarFallback["state"]> } {
    return true
  }
}

export type {
  AvatarFallbackProps,
  AvatarLoadingStatus,
  AvatarLoadingStatusChangeReason,
  AvatarOptions,
  AvatarPrimitive,
  AvatarState,
} from "@ui-sdk/core/avatar"

export { Avatar, AvatarFallback, AvatarImage, type AvatarLoadingStatusChange }
