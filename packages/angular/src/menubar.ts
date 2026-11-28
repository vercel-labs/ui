import { Directive, inject, input, type InputSignal } from "@angular/core"
import { menubar, type MenubarOptions } from "@ui-sdk/core/menubar"
import { optionalBoolean } from "./inputs.ts"
import { MenubarContext } from "./menubar-context.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * A row of menus, like a desktop app's: one tab stop, arrow keys between the triggers and between open menus. Each `uiMenu` inside joins it.
 * @experimental
 */
@Directive({
  selector: "[uiMenubar]",
  exportAs: "uiMenubar",
  providers: [
    { provide: MenubarContext, useFactory: () => inject(Menubar).handle },
  ],
})
class Menubar {
  /** Logs every state change. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Which arrow keys move between menus: left and right, or up and down. A vertical menubar opens its menus to the side. */
  readonly orientation: InputSignal<MenubarOptions["orientation"]> = input()
  /** Whether arrow keys wrap from the last menu to the first, between triggers and between open menus. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Stops every menu from opening. Triggers stay focusable with `aria-disabled`, so the menubar keeps its tab stop. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** The `modal` setting of every menu in the menubar that doesn't set its own. */
  readonly modal: InputSignal<MenubarOptions["modal"]> = input()
  /** Opens, closes and focuses the menubar from anywhere. Create one with `createMenubarController()`. */
  readonly controller: InputSignal<MenubarOptions["controller"]> = input()

  readonly handle = usePrimitive(menubar, () => ({
    debug: this.debug(),
    orientation: this.orientation(),
    loop: this.loop(),
    disabled: this.disabled(),
    modal: this.modal(),
    controller: this.controller(),
  }))
  /** The menubar's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

export { createMenubarController } from "@ui-sdk/core/menubar"
export type {
  MenubarApi,
  MenubarController,
  MenubarMember,
  MenubarOptions,
  MenubarOrientation,
  MenubarPrimitive,
  MenubarState,
} from "@ui-sdk/core/menubar"

export { Menubar }
