import { Directive, input, type InputSignal } from "@angular/core"
import { separator, type SeparatorOptions } from "@ui-sdk/core/separator"
import { optionalBoolean } from "./inputs.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * A line between groups of content, announced as a separator unless it's `decorative`.
 * @experimental
 */
@Directive({ selector: "[uiSeparator]", exportAs: "uiSeparator" })
class Separator {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Which way the line runs. A vertical separator divides items in a row. */
  readonly orientation: InputSignal<SeparatorOptions["orientation"]> = input()
  /** Hides the separator from assistive technology with `role="none"`, for a line that's only visual. Leave it off when the separator divides content a screen reader should hear as separate, like groups of menu items. */
  readonly decorative = input(undefined, { transform: optionalBoolean })

  readonly handle = usePrimitive(separator, () => ({
    debug: this.debug(),
    orientation: this.orientation(),
    decorative: this.decorative(),
  }))
  /** The separator's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

export type {
  SeparatorOptions,
  SeparatorOrientation,
  SeparatorPrimitive,
  SeparatorState,
} from "@ui-sdk/core/separator"

export { Separator }
