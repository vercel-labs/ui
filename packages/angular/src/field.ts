import {
  afterRenderEffect,
  Directive,
  effect,
  ElementRef,
  HostAttributeToken,
  inject,
  input,
  type InputSignal,
} from "@angular/core"
import {
  field,
  fieldGroup,
  fieldSet,
  type FieldErrorProps,
  type FieldErrorState,
  type FieldOptions,
} from "@ui-sdk/core/field"
import {
  checkFieldOutside,
  fieldOutsideAttrs,
  fieldOutsideErrorShown,
  type FieldOutsideSlot,
} from "@ui-sdk/core/renderer"
import {
  controlProps,
  FieldContext,
  FieldDescribed,
  FieldSetContext,
  type FieldScope,
} from "./field-context.ts"
import { optionalBoolean } from "./inputs.ts"
import { useText } from "./text.ts"
import { useId, usePart, usePrimitive } from "./use-primitive.ts"

// A part outside any field is a plain element with the attributes its styles
// select on, so a FieldLabel is a native <label> for the control it wraps.
function useOutside(slot: FieldOutsideSlot, shown: () => boolean = () => true) {
  const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  if (el.nodeType !== 1) {
    return
  }
  for (const [name, value] of Object.entries(fieldOutsideAttrs(slot))) {
    el.setAttribute(name, value)
  }
  effect(() => {
    el.hidden = !shown()
  })
  if (slot !== "description" && slot !== "error") {
    afterRenderEffect(() => checkFieldOutside(el, slot))
  }
}

/**
 * Ties a form control to its label, description and error messages.
 * @experimental
 */
@Directive({
  selector: "[uiField]",
  exportAs: "uiField",
  providers: [
    {
      provide: FieldContext,
      useFactory: () => {
        const field = inject(Field)
        return {
          handle: field.handle,
          name: field.name,
          disabled: field.disabled,
        }
      },
    },
    {
      provide: FieldDescribed,
      useFactory: () => inject(Field).handle,
    },
  ],
})
class Field {
  /** The name the control submits under, when the control doesn't set its own. */
  readonly name: InputSignal<FieldOptions["name"]> = input()
  /** Disables the control, and marks every part. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Whether the field shows as invalid, when your code decides, like a form library or an error from the server. `true` shows its errors now, `false` shows none whatever the browser thinks. Leave it out to show the browser's own validation once a submit finds the field invalid. */
  readonly invalid = input(undefined, { transform: optionalBoolean })
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })

  readonly handle = usePrimitive(field, () => ({
    name: this.name(),
    disabled: this.disabled(),
    invalid: this.invalid(),
    debug: this.debug(),
  }))
  /** The field's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * The field's label, which names its control. Outside a Field it's a plain
 * `<label>`, which labels the control inside it, like a card around a whole Field.
 * @experimental
 */
@Directive({ selector: "[uiFieldLabel]", exportAs: "uiFieldLabel" })
class FieldLabel {
  readonly #field = inject(FieldContext, { optional: true })
  /** The field's state, as a signal. Undefined outside a Field. */
  readonly state = this.#field
    ? usePart(this.#field.handle, "label").state
    : useOutside("label")
}

/**
 * Describes its Field. Right inside a FieldSet, outside any Field, it
 * describes the group, so screen readers say it as focus enters the group.
 * @experimental
 */
@Directive({ selector: "[uiFieldDescription]", exportAs: "uiFieldDescription" })
class FieldDescription {
  readonly #described = inject(FieldDescribed, { optional: true })
  readonly #value = useId()
  /** The field's state, as a signal. Undefined outside a Field and a FieldSet. */
  readonly state = this.#described
    ? usePart(this.#described as FieldScope["handle"], "description", () => ({
        value: this.#value,
      })).state
    : useOutside("description")
}

/**
 * Shows while the field shows as invalid. Without content, it shows the
 * browser's message for the current problem. `*uiFieldError` renders it only
 * while it's shown.
 * @experimental
 */
@Directive({ selector: "[uiFieldError]", exportAs: "uiFieldError" })
class FieldError {
  /** When this error shows. `true` shows it always and `false` never. A validity flag, like `"valueMissing"`, shows it only for that problem of the browser's own validation. Without it, any problem shows it. */
  readonly match: InputSignal<FieldErrorProps["match"]> = input()
  /** `match`, for the `*` form, which leaves other attributes on the element inside: `*uiFieldError="'valueMissing'"`. */
  readonly uiFieldError: InputSignal<FieldErrorProps["match"] | ""> = input()
  readonly #match = () => this.match() ?? (this.uiFieldError() || undefined)

  readonly #field = inject(FieldContext, { optional: true })
  readonly #value = useId()
  readonly #part = this.#field
    ? usePart(this.#field.handle, "error", () => ({
        value: this.#value,
        match: this.#match(),
      }))
    : undefined
  /** The error's state, as a signal. Undefined outside a Field. */
  readonly state =
    this.#part?.state ??
    useOutside("error", () => fieldOutsideErrorShown({ match: this.#match() }))

  constructor() {
    const state = this.state
    if (state) {
      useText(() => state().message, "data-message", this.#part?.element)
    }
  }

  static ngTemplateContextGuard(
    _directive: FieldError,
    context: unknown
  ): context is { $implicit: FieldErrorState } {
    return true
  }
}

/**
 * A native control, like an `<input>`, wired to the Field it's in.
 * @experimental
 */
@Directive({ selector: "[uiFieldControl]", exportAs: "uiFieldControl" })
class FieldControl {
  readonly #field = inject(FieldContext, { optional: true })
  /** The field's state, as a signal. Undefined outside a Field. */
  readonly state = this.#field
    ? usePart(this.#field.handle, "control", controlProps()).state
    : useOutside("control")

  constructor() {
    const field = this.#field
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    const own = inject(new HostAttributeToken("name"), { optional: true })
    if (field && own === null) {
      let gave: string | undefined
      effect(() => {
        const name = field.name()
        const current = el.getAttribute("name")
        // A name the author bound, like `[name]`, stays. The server's is ours.
        if (current !== null && current !== gave && current !== name) {
          return
        }
        if (name) {
          el.setAttribute("name", name)
        } else if (current !== null) {
          el.removeAttribute("name")
        }
        gave = name
      })
    }
  }
}

/**
 * Lays fields out. It has no role: a FieldSet is what names and disables a group.
 * @experimental
 */
@Directive({ selector: "[uiFieldGroup]", exportAs: "uiFieldGroup" })
class FieldGroup {
  readonly handle = usePrimitive(fieldGroup, () => ({}))
  /** The field group's state, as a signal. */
  readonly state = usePart(this.handle, "group").state
}

/**
 * A native `<fieldset>`, so `disabled` disables every control inside it.
 * @experimental
 */
@Directive({
  selector: "[uiFieldSet]",
  exportAs: "uiFieldSet",
  providers: [
    {
      provide: FieldSetContext,
      useFactory: () => inject(FieldSet).handle,
    },
    {
      provide: FieldDescribed,
      useFactory: () => inject(FieldSet).handle,
    },
  ],
})
class FieldSet {
  /** Disables every control inside it, except those in its legend, and leaves them out of the form. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })

  readonly handle = usePrimitive(fieldSet, () => ({
    disabled: this.disabled(),
    debug: this.debug(),
  }))
  /** The field set's state, as a signal. */
  readonly state = usePart(this.handle, "set").state
}

/**
 * Names the field set. Keep it the set's first child, where a `<legend>` names it natively.
 * @experimental
 */
@Directive({ selector: "[uiFieldLegend]", exportAs: "uiFieldLegend" })
class FieldLegend {
  /** The field set's state, as a signal. */
  readonly state = usePart(inject(FieldSetContext), "legend").state
}

export { useFieldControl } from "./field-context.ts"
export type {
  FieldApi,
  FieldDescriptionState,
  FieldErrorProps,
  FieldErrorState,
  FieldGroupPrimitive,
  FieldOptions,
  FieldPrimitive,
  FieldSetOptions,
  FieldSetPrimitive,
  FieldSetState,
  FieldState,
  ValidityKey,
} from "@ui-sdk/core/field"

export {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
}
