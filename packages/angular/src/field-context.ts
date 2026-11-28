import {
  computed,
  HostAttributeToken,
  inject,
  InjectionToken,
} from "@angular/core"
import type { Attrs } from "@ui-sdk/core"
import type { field, fieldSet } from "@ui-sdk/core/field"
import { fieldControlId } from "@ui-sdk/core/renderer"
import type { Joined, PrimitiveHandle } from "./use-primitive.ts"

type FieldScope = {
  handle: PrimitiveHandle<typeof field>
  name: () => string | undefined
  disabled: () => boolean | undefined
}

const FieldContext = new InjectionToken<FieldScope>("ui-sdk field")

// What a FieldDescription describes: the nearest Field, or a FieldSet when no
// Field is closer.
const FieldDescribed = new InjectionToken<
  PrimitiveHandle<typeof field> | PrimitiveHandle<typeof fieldSet>
>("ui-sdk field described")

const FieldSetContext = new InjectionToken<PrimitiveHandle<typeof fieldSet>>(
  "ui-sdk field set"
)

// The field decides the id and what names and describes the control. The
// control stays its own part for styling, so it keeps its `data-slot`.
const merge = (own: Attrs, control: Attrs) => {
  const merged = { ...own }
  for (const [name, value] of Object.entries(control)) {
    if (value !== undefined && name !== "data-slot") {
      merged[name] = value
    }
  }
  return merged
}

// The author's own id and description on the control, which the field keeps.
// Read from the template, since the element may hold what the server wrote.
function controlProps() {
  const read = (name: string) =>
    inject(new HostAttributeToken(name), { optional: true }) ?? undefined
  const props = { id: read("id"), describedBy: read("aria-describedby") }
  return () => props
}

/**
 * Controls inside a field take its name and disabled state, and its ids and
 * validity through `joined`, which goes to the `usePart` of the element the
 * label names. Undefined outside a field. Call it in a field initializer.
 * `props` replaces the id and description read from the element.
 * @experimental
 */
function useFieldControl(
  props: () => { id?: string; describedBy?: string } = controlProps()
) {
  const context = inject(FieldContext, { optional: true })
  if (!context) {
    return undefined
  }
  const joined: Joined = {
    part: computed(() => context.handle.instance.part("control", props()), {
      equal: () => false,
    }),
    merge,
  }
  return {
    name: context.name,
    disabled: context.disabled,
    /** The id the field's label points at before anything binds. */
    controlId: () => fieldControlId(context.handle.api.id),
    joined,
  }
}

export {
  controlProps,
  FieldContext,
  FieldDescribed,
  type FieldScope,
  FieldSetContext,
  useFieldControl,
}
