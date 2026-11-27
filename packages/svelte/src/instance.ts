// The rendering contract's way to find an instance: a root provides its
// instance under the primitive itself, and `usePart` given the primitive
// uses the nearest one. Its own module, so a component that passes its
// handle around never bundles Svelte's context code for it.
import type { Primitive, PropsOf, SlotName } from "@ui-sdk/core"
import { schemaOf } from "@ui-sdk/core/renderer"
import { getContext, setContext } from "svelte"
import {
  primitives,
  useHandlePart,
  type Portal,
  type PrimitiveHandle,
} from "./use-primitive.svelte"

/** Makes `handle` the nearest instance of `primitive` for the parts inside the component. */
function provideInstance<P extends Primitive>(
  primitive: P,
  handle: PrimitiveHandle<P>
) {
  setContext(primitive, handle)
}

/** The nearest instance of `primitive`, which a root provided. Throws outside one. */
function useHandle<P extends Primitive>(primitive: P) {
  const handle = getContext<PrimitiveHandle<P> | undefined>(primitive)
  if (!handle) {
    throw new Error(`A ${primitive.name} part must be used inside its root.`)
  }
  return handle
}

/**
 * Renders one part written by hand: subscribes it to its instance, like
 * the part a `<Part>` renders. `owner` is `usePrimitive`'s handle, or the
 * primitive, whose nearest instance it uses. `slotProps` is a getter of the
 * slot's props, and `portal`, from `portalTo`, moves a popup into its container.
 *
 * @example
 * const star = usePart(rating, "star", () => ({ value }))
 * @stable
 */
function usePart<P extends Primitive, S extends SlotName<P>>(
  owner: P | PrimitiveHandle<P>,
  slot: S,
  slotProps?: () => PropsOf<P, S>,
  portal?: Portal
) {
  const handle = typeof owner === "function" ? useHandle(owner) : owner
  const primitive =
    typeof owner === "function" ? owner : primitives.get(handle.instance)
  if (primitive) {
    provideProps(primitive, slot, slotProps)
  }
  return useHandlePart(handle, slot, slotProps, portal)
}

// The slots whose props a nested part takes `from` them, by primitive.
const providers = new WeakMap<Primitive, Set<string>>()

// Like a generated part, one written by hand provides its props to the parts
// inside it that take them `from` its slot.
function provideProps(
  primitive: Primitive,
  slot: string,
  slotProps?: () => Record<string, unknown>
) {
  const schema = schemaOf(primitive)
  let slots = providers.get(primitive)
  if (!slots) {
    slots = new Set(
      Object.values(schema.slots).flatMap((props) =>
        Object.values(props).flatMap((spec) =>
          typeof spec === "object" ? [spec.from.split(".")[0]] : []
        )
      )
    )
    providers.set(primitive, slots)
  }
  if (slots.has(slot)) {
    type Around = Record<string, () => Record<string, unknown>>
    const around = slot === "root" ? {} : getContext<Around>(schema)
    setContext<Around>(schema, {
      ...around,
      [slot]: () => slotProps?.() ?? {},
    })
  }
}

export { provideInstance, useHandle, usePart }
