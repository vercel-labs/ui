import {
  computed,
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  navigationMenu,
  type NavigationMenuContentProps,
  type NavigationMenuContentState,
  type NavigationMenuItemProps,
  type NavigationMenuOptions,
  type NavigationMenuViewportProps,
} from "@ui-sdk/core/navigation-menu"
import {
  optionalBoolean,
  optionalNumber,
  type StarInput,
  starInputs,
  withStar,
} from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { PopupScope } from "./popup.ts"
import {
  useId,
  usePart,
  usePrimitive,
  type PopupContainer,
  type PrimitiveHandle,
} from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type NavigationMenuValueChange = Parameters<
  NonNullable<NavigationMenuOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<NavigationMenuOptions["onValueChange"]>>[0]
}

/**
 * The menu, on a `<nav>`. Inside another menu's content it's a nested menu, which goes on a `<div>` and closes with its parent.
 * @experimental
 */
@Directive({ selector: "[uiNavigationMenu]", exportAs: "uiNavigationMenu" })
class NavigationMenu {
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The open item's value. Bind it with `[(value)]` to control the menu. `null` closes every panel. */
  readonly value: InputSignal<NavigationMenuOptions["value"]> = input()
  /** The item open at first, when uncontrolled. */
  readonly defaultValue: InputSignal<NavigationMenuOptions["defaultValue"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<NavigationMenuValueChange["value"]>()
  /** Runs when an item wants to open or the open one to close. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeValueChange = output<NavigationMenuValueChange>()
  /** Runs once the menu has finished opening or closing, after any animation. Switching items doesn't count. */
  readonly openChangeComplete =
    output<
      Parameters<NonNullable<NavigationMenuOptions["onOpenChangeComplete"]>>[0]
    >()
  /** Milliseconds the pointer rests on a trigger before its panel opens. */
  readonly delay = input(undefined, { transform: optionalNumber })
  /** Milliseconds before the open panel closes once the pointer leaves its trigger and the panel. */
  readonly closeDelay = input(undefined, { transform: optionalNumber })
  /** Whether resting the pointer on a trigger opens its panel. `false` makes a click-only menu. */
  readonly openOnHover = input(undefined, { transform: optionalBoolean })
  /** Whether pressing a link closes the menu. A link's own `closeOnSelect` wins. */
  readonly closeOnSelect = input(undefined, { transform: optionalBoolean })
  /** Which arrow keys move between the top-level items, and the side panels open on. */
  readonly orientation: InputSignal<NavigationMenuOptions["orientation"]> =
    input()
  /** Opens and closes panels from anywhere. Create one with `createNavigationMenuController()`. */
  readonly controller: InputSignal<NavigationMenuOptions["controller"]> =
    input()
  /** Renders the popups into this element instead of in place. */
  readonly container = input<PopupContainer>()

  readonly #above = inject(NavigationMenu, { optional: true, skipSelf: true })
  readonly #item = inject(NavigationMenuItem, { optional: true })
  readonly #parent = computed(() =>
    this.#above && this.#item
      ? { api: this.#above.handle.api, item: this.#item.key() }
      : undefined
  )
  readonly handle: PrimitiveHandle<typeof navigationMenu> = usePrimitive(
    navigationMenu,
    () => ({
      parent: this.#parent(),
      debug: this.debug(),
      value: this.value(),
      defaultValue: this.defaultValue(),
      onValueChange: emitChange(this.beforeValueChange, this.valueChange),
      onOpenChangeComplete: (value) => this.openChangeComplete.emit(value),
      delay: this.delay(),
      closeDelay: this.closeDelay(),
      openOnHover: this.openOnHover(),
      closeOnSelect: this.closeOnSelect(),
      orientation: this.orientation(),
      controller: this.controller(),
    })
  )
  /** The navigation menu's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * The list of top-level items.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuList]",
  exportAs: "uiNavigationMenuList",
})
class NavigationMenuList {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(NavigationMenu).handle, "list").state
}

/**
 * One item: a link, or a trigger and the content it opens.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuItem]",
  exportAs: "uiNavigationMenuItem",
})
class NavigationMenuItem {
  /** Identifies the item, for `value` and `(valueChange)`. Generated when left out. */
  readonly value: InputSignal<NavigationMenuItemProps["value"]> = input()

  readonly #generated = useId()
  /** The item's value: the one it was given, or the generated one. */
  readonly key = computed(() => this.value() ?? this.#generated)
  /** The part's state, as a signal. */
  readonly state = usePart(inject(NavigationMenu).handle, "item", () => ({
    value: this.key(),
  })).state
}

/**
 * The button that opens its item's content. Resting the pointer on it opens the content too.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuTrigger]",
  exportAs: "uiNavigationMenuTrigger",
})
class NavigationMenuTrigger {
  readonly #item = inject(NavigationMenuItem)

  /** Stops the trigger from opening its panel. A native button can't be focused or pressed. */
  readonly disabled = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(NavigationMenu).handle, "trigger", () => ({
    value: this.#item.key(),
    disabled: this.disabled(),
  })).state
}

/**
 * Renders into the viewport while its item is open, as its own popup without a viewport, and in place while closed and kept. `*uiNavigationMenuContent` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuContent]",
  exportAs: "uiNavigationMenuContent",
  providers: [PopupScope],
})
class NavigationMenuContent {
  /** Which side of the trigger it opens on: below a horizontal menu, at the inline end of a vertical one. */
  readonly side: InputSignal<NavigationMenuContentProps["side"]> = input()
  /** How it lines up with the trigger along that side. */
  readonly align: InputSignal<NavigationMenuContentProps["align"]> = input()
  /** Gap between the trigger and it, in pixels. */
  readonly sideOffset = input(undefined, { transform: optionalNumber })
  /** Shift along the trigger, in pixels. */
  readonly alignOffset = input(undefined, { transform: optionalNumber })
  /** Space to keep from the viewport edges, in pixels. */
  readonly collisionPadding = input(undefined, { transform: optionalNumber })
  /** Space to keep between the arrow and the popup's corners, in pixels. */
  readonly arrowPadding = input(undefined, { transform: optionalNumber })
  /** Positions the popup against this instead of its trigger: an element, a CSS selector, a point like `{ x, y }`, or anything with `getBoundingClientRect()`. It's read on every check, so it can move. A controller's `open({ anchor })` wins for that open. */
  readonly anchor: InputSignal<NavigationMenuContentProps["anchor"]> = input()
  /** Whether the content stays in the page, hidden, while its item is closed, so crawlers and the server's HTML have it. Closed content stays in its item; it moves into the viewport when it opens. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })
  /** Whether closed content stays findable with `hidden="until-found"`, so find in page opens its item. Implies `keepMounted`. */
  readonly hiddenUntilFound = input(undefined, { transform: optionalBoolean })

  /** Renders the content into this element instead of in place, when the menu has no viewport. */
  readonly container = input<PopupContainer>()
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiNavigationMenuContent="{ side: 'bottom' }"`. */
  readonly uiNavigationMenuContent: StarInput<NavigationMenuContentProps> =
    input(undefined, { transform: starInputs<NavigationMenuContentProps> })

  readonly #menu = inject(NavigationMenu)
  readonly #item = inject(NavigationMenuItem)
  readonly #popup = inject(PopupScope, { self: true })
  /** The part's state, as a signal. */
  readonly state = usePart(
    this.#menu.handle,
    "content",
    () => ({
      value: this.#item.key(),
      ...withStar(this.uiNavigationMenuContent(), {
        side: this.side(),
        align: this.align(),
        sideOffset: this.sideOffset(),
        alignOffset: this.alignOffset(),
        collisionPadding: this.collisionPadding(),
        arrowPadding: this.arrowPadding(),
        anchor: this.anchor(),
        keepMounted: this.keepMounted(),
        hiddenUntilFound: this.hiddenUntilFound(),
      }),
    }),
    {
      // In the viewport while its item shows there, in place next to a
      // viewport otherwise, and its own popup without one.
      portal: () => {
        const { api, instance } = this.#menu.handle
        const viewport = api.internal.viewportElement()
        if (viewport && api.internal.inViewport(this.#item.key())) {
          return viewport
        }
        return instance.get().viewport ? false : this.#popup.container()
      },
    }
  ).state

  constructor() {
    this.#popup.own = () =>
      this.container() ??
      this.uiNavigationMenuContent()?.container ??
      this.#menu.container()
  }

  static ngTemplateContextGuard(
    _directive: NavigationMenuContent,
    context: unknown
  ): context is { $implicit: NavigationMenuContentState } {
    return true
  }
}

/**
 * A link. Pressing it closes the menu, and `current` marks the current page with `aria-current="page"`.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuLink]",
  exportAs: "uiNavigationMenuLink",
})
class NavigationMenuLink {
  /** Whether the link is the current page. Sets `aria-current="page"` and `data-current`. */
  readonly current = input(undefined, { transform: optionalBoolean })
  /** Whether pressing the link closes the menu. Overrides the menu's `closeOnSelect`. */
  readonly closeOnSelect = input(undefined, { transform: optionalBoolean })

  readonly #id = useId()
  /** The part's state, as a signal. */
  readonly state = usePart(inject(NavigationMenu).handle, "link", () => ({
    id: this.#id,
    current: this.current(),
    closeOnSelect: this.closeOnSelect(),
  })).state
}

/**
 * An icon inside a link. Screen readers skip it, and `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuLinkIcon]",
  exportAs: "uiNavigationMenuLinkIcon",
})
class NavigationMenuLinkIcon {
  /** Flips the icon horizontally in right-to-left text, for icons that point a way, like arrows and chevrons. Icons that picture a thing, like a clock or a check, stay as they are. */
  readonly mirror = input(undefined, { transform: optionalBoolean })

  readonly #id = useId()
  /** The part's state, as a signal. */
  readonly state = usePart(inject(NavigationMenu).handle, "link-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
  })).state
}

/**
 * The one popup every content renders into. It takes the open content's size as --viewport-width and --viewport-height, and moves to the open trigger.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuViewport]",
  exportAs: "uiNavigationMenuViewport",
})
class NavigationMenuViewport {
  /** Which side of the trigger it opens on: below a horizontal menu, at the inline end of a vertical one. */
  readonly side: InputSignal<NavigationMenuViewportProps["side"]> = input()
  /** How it lines up with the trigger along that side. */
  readonly align: InputSignal<NavigationMenuViewportProps["align"]> = input()
  /** Gap between the trigger and it, in pixels. */
  readonly sideOffset = input(undefined, { transform: optionalNumber })
  /** Shift along the trigger, in pixels. */
  readonly alignOffset = input(undefined, { transform: optionalNumber })
  /** Space to keep from the viewport edges, in pixels. */
  readonly collisionPadding = input(undefined, { transform: optionalNumber })
  /** Space to keep between the arrow and the popup's corners, in pixels. */
  readonly arrowPadding = input(undefined, { transform: optionalNumber })
  /** Positions the popup against this instead of its trigger: an element, a CSS selector, a point like `{ x, y }`, or anything with `getBoundingClientRect()`. It's read on every check, so it can move. A controller's `open({ anchor })` wins for that open. */
  readonly anchor: InputSignal<NavigationMenuViewportProps["anchor"]> = input()
  /** Renders the viewport into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiNavigationMenuViewport="{ sideOffset: 8 }"`. */
  readonly uiNavigationMenuViewport: StarInput<NavigationMenuViewportProps> =
    input(undefined, { transform: starInputs<NavigationMenuViewportProps> })

  readonly #menu = inject(NavigationMenu)
  readonly #around = inject(PopupScope, { optional: true })
  /** The part's state, as a signal. */
  readonly state = usePart(
    this.#menu.handle,
    "viewport",
    () =>
      withStar(this.uiNavigationMenuViewport(), {
        side: this.side(),
        align: this.align(),
        sideOffset: this.sideOffset(),
        alignOffset: this.alignOffset(),
        collisionPadding: this.collisionPadding(),
        arrowPadding: this.arrowPadding(),
        anchor: this.anchor(),
      }),
    {
      portal: () =>
        this.container() ??
        this.uiNavigationMenuViewport()?.container ??
        this.#menu.container() ??
        this.#around?.container(),
    }
  ).state

  static ngTemplateContextGuard(
    _directive: NavigationMenuViewport,
    context: unknown
  ): context is { $implicit: ReturnType<NavigationMenuViewport["state"]> } {
    return true
  }
}

/**
 * Sits under the open trigger, or under the link with `current` while every panel is closed. Screen readers skip it.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuIndicator]",
  exportAs: "uiNavigationMenuIndicator",
})
class NavigationMenuIndicator {
  /** Whether it follows the top-level trigger or link under the pointer, and goes back to the open or current one when the pointer leaves the list. */
  readonly followHover = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(NavigationMenu).handle, "indicator", () => ({
    followHover: this.followHover(),
  })).state
}

export { createNavigationMenuController } from "@ui-sdk/core/navigation-menu"
export type {
  NavigationMenuApi,
  NavigationMenuChangeOptions,
  NavigationMenuContentProps,
  NavigationMenuContentState,
  NavigationMenuController,
  NavigationMenuIndicatorProps,
  NavigationMenuIndicatorState,
  NavigationMenuItemProps,
  NavigationMenuItemState,
  NavigationMenuLinkIconProps,
  NavigationMenuLinkIconState,
  NavigationMenuLinkProps,
  NavigationMenuLinkState,
  NavigationMenuListState,
  NavigationMenuMotion,
  NavigationMenuOptions,
  NavigationMenuOrientation,
  NavigationMenuPrimitive,
  NavigationMenuState,
  NavigationMenuTriggerProps,
  NavigationMenuTriggerState,
  NavigationMenuValueChangeReason,
  NavigationMenuViewportProps,
  NavigationMenuViewportState,
} from "@ui-sdk/core/navigation-menu"

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuLinkIcon,
  NavigationMenuList,
  NavigationMenuTrigger,
  type NavigationMenuValueChange,
  NavigationMenuViewport,
}
