import { computed, inject, Injectable, type Type } from "@angular/core"
import type { Attrs, Primitive, PropsOf, SlotName } from "@ui-sdk/core"
import type { Feature } from "@ui-sdk/core/renderer"
import { useControllerEntry, useControllerTarget } from "./controller-target.ts"
import { useText } from "./text.ts"
import {
  useFeature,
  useOutsidePart,
  usePart,
  type Joined,
  type PopupContainer,
  type PrimitiveHandle,
} from "./use-primitive.ts"

// What a popup's root hands its parts. Each popup has its own class of it,
// so a tooltip's trigger inside a popover finds the tooltip.
class PopupRoot<P extends Primitive> {
  handle!: PrimitiveHandle<P>
  container: () => PopupContainer = () => undefined
}

// What a trigger hands the shortcut inside it: its keys and the popup it
// opens, which a trigger connected through a controller sits outside of.
class PopupTriggerScope<P extends Primitive> {
  shortcut: () => string | undefined = () => undefined
  root: () => PopupRoot<P> | undefined = () => undefined
}

// The container a popup's content renders into, for the popups inside it:
// they render there too, like a menu inside a portaled popover, unless they
// name their own. A content part provides one.
@Injectable()
class PopupScope {
  readonly #above = inject(PopupScope, { optional: true, skipSelf: true })
  own: () => PopupContainer = () => undefined
  readonly container: () => PopupContainer = () =>
    this.own() ?? this.#above?.container()
}

// Fills the root's scope and registers it with its controller, for triggers outside it.
function usePopupRoot<Root extends PopupRoot<any>>(
  scope: Type<Root>,
  root: Partial<Root>,
  controller: () => object | undefined
) {
  useControllerEntry(
    controller,
    Object.assign(inject(scope, { self: true }), root)
  )
}

// What a trigger shows until the popup its controller names is on the page.
const plainButton =
  (
    disabled: () => boolean | undefined = () => false,
    focusable: () => boolean | undefined = () => false
  ) =>
  () => ({
    type: "button",
    disabled: disabled() && !focusable() ? "" : undefined,
    "aria-disabled": disabled() && focusable() ? "true" : undefined,
  })

// A trigger's part: of the popup its `controller` is attached to, from
// anywhere on the page, or else the popup it sits in.
function usePopupTrigger<P extends Primitive, S extends SlotName<P>>(
  scope: Type<PopupRoot<P>>,
  slot: S,
  props: () => PropsOf<P, S>,
  {
    controller,
    plain = plainButton(),
    inside,
    shortcut,
    feature,
    joined,
  }: {
    controller: () => object | undefined
    joined?: Joined
    plain?: () => Attrs
    inside?: Type<PopupTriggerScope<P>>
    shortcut?: () => string | undefined
    feature?: Feature
  }
) {
  const root = useControllerTarget(
    controller,
    inject(scope, { optional: true }) ?? undefined
  )
  if (inside) {
    const trigger = inject(inside, { self: true })
    trigger.root = root
    trigger.shortcut = shortcut ?? trigger.shortcut
  }
  // Each popup the part binds to gets the feature that ships its slot first.
  const owner = () => {
    const handle = root()?.handle
    if (handle && feature) {
      useFeature(handle, feature)
    }
    return handle
  }
  return useOutsidePart(owner, slot, props, { joined }, plain)
}

// A part of the popup that can sit inside its trigger, like a select's value:
// a trigger outside the popup brings the popup it's connected to.
function useTriggerPart<P extends Primitive, S extends SlotName<P>>(
  scope: Type<PopupRoot<P>>,
  inside: Type<PopupTriggerScope<P>>,
  slot: S,
  props?: () => PropsOf<P, S>,
  feature?: Feature
) {
  const root = inject(scope, { optional: true })
  const trigger = inject(inside, { optional: true })
  return useOutsidePart(
    () => {
      const handle = (trigger?.root() ?? root ?? undefined)?.handle
      if (handle && feature) {
        useFeature(handle, feature)
      }
      return handle
    },
    slot,
    props
  )
}

// A content part: it renders into its own container, else its root's, else
// the popup's around it. `viewport` is for a popup that can present as a
// sheet, and `header` hears the element an input moves into at a sheet's top.
function usePopupContent<P extends Primitive, S extends SlotName<P>>(
  root: PopupRoot<P>,
  slot: S,
  props: () => PropsOf<P, S>,
  {
    container,
    inline,
    viewport,
    header,
  }: {
    container: () => PopupContainer
    inline?: () => boolean | undefined
    viewport?: boolean
    header?: (el: HTMLElement | null) => void
  }
) {
  const popup = inject(PopupScope, { self: true })
  popup.own = () => container() ?? root.container()
  return usePart(root.handle, slot, props, {
    portal: () => (inline?.() ? false : popup.container()),
    viewport: viewport
      ? () => root.handle.instance.part("viewport" as S, {} as PropsOf<P, S>)
      : undefined,
    header: header && {
      part: () => root.handle.instance.part("header" as S, {} as PropsOf<P, S>),
      record: header,
    },
  })
}

// A part that renders where its popup's content does, like a backdrop.
function usePopupLayer<P extends Primitive, S extends SlotName<P>>(
  root: PopupRoot<P>,
  slot: S
) {
  const around = inject(PopupScope, { optional: true })
  return usePart(root.handle, slot, undefined, {
    portal: () => root.container() ?? around?.container(),
  })
}

// A shortcut part, which shows its trigger's keys when the element is left empty.
function usePopupShortcut<P extends Primitive>(
  scope: Type<PopupRoot<P>>,
  inside: Type<PopupTriggerScope<P>>,
  shortcut: () => string | undefined
) {
  const root = inject(scope, { optional: true })
  const trigger = inject(inside, { optional: true })
  const part = useOutsidePart(
    () => (trigger?.root() ?? root ?? undefined)?.handle,
    "shortcut" as SlotName<P>,
    () =>
      ({ shortcut: shortcut() ?? trigger?.shortcut() }) as PropsOf<
        P,
        SlotName<P>
      >
  )
  const state = computed(
    () => (part.state() ?? { text: "" }) as { text: string }
  )
  useText(() => state().text)
  return state
}

export { useControllerEntry, useControllerTarget } from "./controller-target.ts"

export {
  plainButton,
  PopupRoot,
  PopupScope,
  PopupTriggerScope,
  usePopupContent,
  usePopupLayer,
  usePopupRoot,
  usePopupShortcut,
  usePopupTrigger,
  useTriggerPart,
}
