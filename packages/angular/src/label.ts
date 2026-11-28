import { Directive, input } from "@angular/core"
import { label } from "@ui-sdk/core/label"
import { optionalBoolean } from "./inputs.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * A native <label> that names any control, by `for` or by wrapping it. A control a <label> can't reach, like a radio group or a slider, takes it as its name, and a press on the label activates it.
 * @experimental
 */
@Directive({ selector: "[uiLabel]", exportAs: "uiLabel" })
class Label {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })

  readonly handle = usePrimitive(label, () => ({
    debug: this.debug(),
  }))
  /** The label's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

export type { LabelOptions, LabelPrimitive } from "@ui-sdk/core/label"

export { Label }
