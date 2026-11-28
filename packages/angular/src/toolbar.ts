import { Directive, inject, input, type InputSignal } from "@angular/core"
import { toolbar, type ToolbarOptions } from "@ui-sdk/core/toolbar"
import { optionalBoolean } from "./inputs.ts"
import { ToolbarGroupDisabled, ToolbarHandle } from "./toolbar-context.ts"
import { useId, usePart, usePrimitive } from "./use-primitive.ts"

/**
 * A row of controls with one tab stop and arrow keys between them. Toggles and toggle groups inside join it. Put `uiToolbarButton` on menu and select triggers, and `uiToolbarInput` on fields.
 * @experimental
 */
@Directive({
  selector: "[uiToolbar]",
  exportAs: "uiToolbar",
  providers: [
    { provide: ToolbarHandle, useFactory: () => inject(Toolbar).handle },
  ],
})
class Toolbar {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Which arrow keys move between items: left and right, or up and down. */
  readonly orientation: InputSignal<ToolbarOptions["orientation"]> = input()
  /** Whether arrow keys wrap from the last item to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Stops every item from being used. Items stay focusable with `aria-disabled`, so the toolbar keeps its tab stop and stays discoverable. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Focuses the toolbar from anywhere. Create one with `createToolbarController()`. */
  readonly controller: InputSignal<ToolbarOptions["controller"]> = input()

  readonly handle = usePrimitive(toolbar, () => ({
    debug: this.debug(),
    orientation: this.orientation(),
    loop: this.loop(),
    disabled: this.disabled(),
    controller: this.controller(),
  }))
  /** The toolbar's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * A button in the toolbar. Arrow keys move between it and the toolbar's other items.
 * @experimental
 */
@Directive({ selector: "[uiToolbarButton]", exportAs: "uiToolbarButton" })
class ToolbarButton {
  readonly #group = inject(ToolbarGroup, { optional: true })
  readonly #id = useId()

  /** Stops the item from being used. It stays focusable with `aria-disabled`, so arrow keys still reach it and a tooltip can say why. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Whether a disabled item stays reachable with arrow keys. Turn it off to skip it, natively disabled. */
  readonly focusableWhenDisabled = input(undefined, {
    transform: optionalBoolean,
  })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Toolbar).handle, "button", () => ({
    id: this.#id,
    disabled: this.disabled(),
    focusableWhenDisabled: this.focusableWhenDisabled(),
    groupDisabled: this.#group?.disabled(),
  })).state
}

/**
 * A link in the toolbar. Arrow keys move between it and the toolbar's other items.
 * @experimental
 */
@Directive({ selector: "[uiToolbarLink]", exportAs: "uiToolbarLink" })
class ToolbarLink {
  readonly #group = inject(ToolbarGroup, { optional: true })
  readonly #id = useId()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Toolbar).handle, "link", () => ({
    id: this.#id,
    groupDisabled: this.#group?.disabled(),
  })).state
}

/**
 * A text field. Arrows move its caret, and leave it only from the end they point at.
 * @experimental
 */
@Directive({ selector: "[uiToolbarInput]", exportAs: "uiToolbarInput" })
class ToolbarInput {
  readonly #group = inject(ToolbarGroup, { optional: true })
  readonly #id = useId()

  /** Stops the item from being used. It stays focusable with `aria-disabled`, so arrow keys still reach it and a tooltip can say why. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Whether a disabled item stays reachable with arrow keys. Turn it off to skip it, natively disabled. */
  readonly focusableWhenDisabled = input(undefined, {
    transform: optionalBoolean,
  })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Toolbar).handle, "input", () => ({
    id: this.#id,
    disabled: this.disabled(),
    focusableWhenDisabled: this.focusableWhenDisabled(),
    groupDisabled: this.#group?.disabled(),
  })).state
}

/**
 * A group of related items in the toolbar. `disabled` disables every item in it.
 * @experimental
 */
@Directive({
  selector: "[uiToolbarGroup]",
  exportAs: "uiToolbarGroup",
  providers: [
    {
      provide: ToolbarGroupDisabled,
      useFactory: () => {
        const group = inject(ToolbarGroup)
        return () => group.state().disabled
      },
    },
  ],
})
class ToolbarGroup {
  /** Disables every item in the group. They stay focusable with `aria-disabled`. */
  readonly disabled = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Toolbar).handle, "group", () => ({
    disabled: this.disabled(),
  })).state
}

/**
 * A line between groups of items.
 * @experimental
 */
@Directive({ selector: "[uiToolbarSeparator]", exportAs: "uiToolbarSeparator" })
class ToolbarSeparator {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Toolbar).handle, "separator").state
}

export { createToolbarController } from "@ui-sdk/core/toolbar"
export type {
  ToolbarApi,
  ToolbarButtonProps,
  ToolbarButtonState,
  ToolbarController,
  ToolbarGroupProps,
  ToolbarGroupState,
  ToolbarInputProps,
  ToolbarInputState,
  ToolbarLinkState,
  ToolbarOptions,
  ToolbarOrientation,
  ToolbarPrimitive,
  ToolbarState,
  ToolbarSeparatorState,
} from "@ui-sdk/core/toolbar"

export {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
}
