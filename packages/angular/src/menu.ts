import {
  afterNextRender,
  Component,
  computed,
  Directive,
  inject,
  Injectable,
  input,
  output,
  signal,
  type InputSignal,
} from "@angular/core"
import { formatShortcut, type DismissAttemptDetails } from "@ui-sdk/core"
import {
  menu,
  type MenuActionDetails,
  type MenuCheckedChangeDetails,
  type MenuCheckedChangeReason,
  type MenuContentProps,
  type MenuContentState,
  type MenuContextTriggerProps,
  type MenuContextTriggerState,
  type MenuData,
  type MenuDataItem,
  type MenuDismissReason,
  type MenuItemProps,
  type MenuOpenChangeReason,
  type MenuOptions,
  type MenuPayloadChangeReason,
  type MenuTriggerProps,
  type MenuTriggerState,
  type MenuValueChangeDetails,
  type MenuValueChangeReason,
} from "@ui-sdk/core/menu"
import {
  isApple,
  menuCheckable,
  menuContextTrigger,
  menuItemIcons,
} from "@ui-sdk/core/renderer"
import {
  optionalBoolean,
  optionalNumber,
  type StarInput,
  starInputs,
  withStar,
} from "./inputs.ts"
import { MenubarContext } from "./menubar-context.ts"
import {
  emitChange,
  emitTypedChange,
  EventActionEmitter,
  ValueActionEmitter,
  type Change,
  type Waiting,
} from "./outputs.ts"
import {
  plainButton,
  PopupRoot,
  PopupScope,
  usePopupContent,
  usePopupRoot,
  usePopupTrigger,
} from "./popup.ts"
import { useText } from "./text.ts"
import {
  useFeature,
  useId,
  usePart,
  usePrimitive,
  type PopupContainer,
} from "./use-primitive.ts"

/**
 * What `(beforeOpenChange)` emits: whether the menu is about to open, why,
 * and `cancel()` to leave it as it is.
 * @experimental
 */
type MenuOpenChange = Change<boolean, MenuOpenChangeReason>

/**
 * What `(beforePayloadChange)` emits: the payload the content is about to
 * show, why, and `cancel()` to keep the previous one.
 * @experimental
 */
type MenuPayloadChange = Change<unknown, MenuPayloadChangeReason>

/**
 * What a menu's `(action)` emits: the item's value, the event that ran it,
 * and `waitUntil()`.
 * @experimental
 */
type MenuAction = MenuActionDetails &
  Waiting & {
    /** The `value` of the item that ran. */
    value: string
  }

/**
 * What a menu's `(checkedChange)` emits: the item's value, its new state,
 * why, and `cancel()` to keep it as it is.
 * @experimental
 */
type MenuCheckedChange = MenuCheckedChangeDetails & {
  /** Whether the item would be checked. */
  checked: boolean
}

/**
 * What a menu's `(valueChange)` emits: the group, its new value, why, and
 * `cancel()` to keep the current one.
 * @experimental
 */
type MenuValueChange = MenuValueChangeDetails & {
  /** The value the group would take. */
  value: string
}

/**
 * What an item's `(select)` emits: the event that selected it and `waitUntil()`.
 * @experimental
 */
type MenuItemSelect = Waiting & {
  /** The event that selected the item, or a new `select` Event when no DOM event did. */
  event: Event
}

/**
 * What a checkbox item's `(beforeCheckedChange)` emits: whether it's about to
 * be checked, why, and `cancel()` to keep it as it is.
 * @experimental
 */
type MenuCheckboxItemCheckedChange = Change<boolean, MenuCheckedChangeReason>

/**
 * What a radio group's `(beforeValueChange)` emits: the value about to be
 * selected, why, and `cancel()` to keep the current one.
 * @experimental
 */
type MenuRadioGroupValueChange<Value extends string = string> = Change<
  Value,
  MenuValueChangeReason
>

// What a menu or a submenu hands its parts. A submenu renders inside its
// parent's popup and moves with it.
@Injectable()
class MenuScope extends PopupRoot<typeof menu> {
  nested = false
}

// What an item hands the parts inside it: its shortcut, and for a checkbox
// or radio item, what its indicator shows.
@Injectable()
class MenuItemScope {
  shortcut: () => string | undefined = () => undefined
  checkable: () =>
    | { item: "checkbox-item" | "radio-item"; itemKey: string; group?: string }
    | undefined = () => undefined
}

/**
 * A list of actions and options, opened from a button or a right-click. Put
 * its trigger and content inside. It has no element of its own, so it can sit
 * on an `<ng-container>`.
 * @experimental
 */
@Directive({
  selector: "[uiMenu]",
  exportAs: "uiMenu",
  providers: [MenuScope, { provide: MenubarContext, useValue: null }],
  outputs: ["action"],
})
class Menu {
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Whether the menu is open. Bind it with `[(open)]` to control the menu. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** Whether the menu starts open, when uncontrolled. */
  readonly defaultOpen = input(undefined, { transform: optionalBoolean })
  /** Whether the menu is open, after a change that wasn't canceled. */
  readonly openChange = output<boolean>()
  /** Runs when the menu wants to open or close. `$event.cancel()` stops it. */
  readonly beforeOpenChange = output<MenuOpenChange>()
  /** Runs once the menu has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** The payload the content shows, after a change that wasn't canceled. */
  readonly payloadChange = output<unknown>()
  /** Runs when the payload the content shows changes. `$event.cancel()` keeps the previous one. */
  readonly beforePayloadChange = output<MenuPayloadChange>()
  /** Runs for every plain item, including items in submenus, with the item's value in `$event.value`. Pass a Promise to `$event.waitUntil()` to keep the item pending, and the menu open, until it settles. */
  readonly action = new ValueActionEmitter<string, MenuActionDetails>()
  /** What screen readers hear once an item has been pending for a second. An empty string says nothing. */
  readonly pendingAnnouncement: InputSignal<
    MenuOptions["pendingAnnouncement"]
  > = input()
  /** Runs when any checkbox item in the menu or its submenus toggles, with the item's value in `$event.value` and its new state in `$event.checked`. `$event.cancel()` stops it. */
  readonly checkedChange = output<MenuCheckedChange>()
  /** Runs when any radio group in the menu or its submenus changes, with the group in `$event.group` and its new value in `$event.value`. `$event.cancel()` stops it. */
  readonly valueChange = output<MenuValueChange>()
  /** The menu as data. `uiMenuItems` renders it inside your content, and the menu runs the items' shortcuts. */
  readonly items: InputSignal<MenuOptions["items"]> = input()
  /** Whether a data menu runs its items' shortcuts while closed. */
  readonly itemShortcuts = input(undefined, { transform: optionalBoolean })
  /** Whether arrow keys wrap from the last item to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Milliseconds the pointer rests on a submenu trigger before its submenu opens. */
  readonly delay = input(undefined, { transform: optionalNumber })
  /** How the menu presents: a popover, a sheet, or `"auto"` for a sheet on small touch screens. */
  readonly presentation: InputSignal<MenuOptions["presentation"]> = input()
  /** Opens, closes and inspects the menu from anywhere, and connects triggers outside it. Create one with `createMenuController()`. */
  readonly controller: InputSignal<MenuOptions["controller"]> = input()
  /** `"pointer"`: an outside press only closes the menu. `true`: also locks scroll, traps focus and makes the page inert. `false`: outside presses reach what they hit. */
  readonly modal: InputSignal<MenuOptions["modal"]> = input()
  /** Whether Escape, an outside press, focus or the window leaving, Android's back gesture, the screen reader's escape gesture and a swipe on a sheet can close the menu. Triggers, items and the controller always can. */
  readonly dismissible = input(undefined, { transform: optionalBoolean })
  /** Runs when `dismissible` refused a dismissal made on purpose: Escape, an outside press, back, the screen reader's escape or a swipe. Focus or the window leaving is refused without it. */
  readonly dismissAttempt = output<DismissAttemptDetails<MenuDismissReason>>()
  /** Renders the menu into this element instead of in place. */
  readonly container = input<PopupContainer>()

  readonly #menubar = inject(MenubarContext, {
    optional: true,
    skipSelf: true,
  })
  readonly handle = usePrimitive(menu, () => ({
    debug: this.debug(),
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    onOpenChange: emitChange(this.beforeOpenChange, this.openChange),
    onOpenChangeComplete: (open) => this.openChangeComplete.emit(open),
    onPayloadChange: emitChange(this.beforePayloadChange, this.payloadChange),
    onAction: this.action.handler(),
    pendingAnnouncement: this.pendingAnnouncement(),
    onCheckedChange: (checked, details) =>
      this.checkedChange.emit(Object.assign(details, { checked })),
    onValueChange: (value, details) =>
      this.valueChange.emit(Object.assign(details, { value })),
    items: this.items(),
    itemShortcuts: this.itemShortcuts(),
    loop: this.loop(),
    delay: this.delay(),
    presentation: this.presentation(),
    controller: this.controller(),
    modal: this.modal(),
    dismissible: this.dismissible(),
    onDismissAttempt: (details) => this.dismissAttempt.emit(details),
    menubar: this.#menubar ? () => this.#menubar?.api : undefined,
  }))

  constructor() {
    usePopupRoot(
      MenuScope,
      { handle: this.handle, container: this.container },
      () => this.controller()
    )
  }
}

/**
 * A submenu. Put its `uiMenuSubTrigger` and `uiMenuSubContent` inside, in a
 * menu's content. It has no element of its own, so it can sit on an `<ng-container>`.
 * @experimental
 */
@Directive({
  selector: "[uiMenuSub]",
  exportAs: "uiMenuSub",
  providers: [MenuScope],
})
class MenuSub {
  /** Whether the submenu is open. Bind it with `[(open)]` to control the submenu. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** Whether the submenu starts open, when uncontrolled. */
  readonly defaultOpen = input(undefined, { transform: optionalBoolean })
  /** Milliseconds the pointer rests on a submenu trigger inside before its submenu opens. */
  readonly delay = input(undefined, { transform: optionalNumber })
  /** Whether arrow keys wrap from the last item to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Opens, closes and inspects the submenu. Create one with `createMenuController()`. Triggers outside the menu can't connect to it. */
  readonly controller: InputSignal<MenuOptions["controller"]> = input()
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Whether the submenu is open, after a change that wasn't canceled. */
  readonly openChange = output<boolean>()
  /** Runs when the submenu wants to open or close. `$event.cancel()` stops it. */
  readonly beforeOpenChange = output<MenuOpenChange>()
  /** Runs once the submenu has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()

  readonly #parent = inject(MenuScope, { skipSelf: true })
  readonly handle = usePrimitive(menu, () => ({
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    delay: this.delay(),
    loop: this.loop(),
    controller: this.controller(),
    debug: this.debug(),
    parent: this.#parent.handle.api,
    onOpenChange: emitChange(this.beforeOpenChange, this.openChange),
    onOpenChangeComplete: (open) => this.openChangeComplete.emit(open),
  }))

  constructor() {
    Object.assign(inject(MenuScope, { self: true }), {
      handle: this.handle,
      nested: true,
    })
  }
}

/**
 * The button that opens the menu. A trigger outside the menu connects through
 * `controller`, and is a plain button until that menu is on the page.
 * @experimental
 */
@Directive({ selector: "[uiMenuTrigger]", exportAs: "uiMenuTrigger" })
class MenuTrigger {
  /** Stops the trigger from opening the menu. A native button can't be focused or pressed, unless `focusableWhenDisabled` is set. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps a disabled trigger in the tab order with `aria-disabled` instead of the native attribute, so it can host a tooltip that says why. */
  readonly focusableWhenDisabled = input(undefined, {
    transform: optionalBoolean,
  })
  /** Data for the content to render when this trigger opens the menu, like the row it belongs to. */
  readonly payload = input<unknown>()
  /** A keyboard shortcut that opens the menu from anywhere, like `"mod+j"`. `mod` is Command on Apple platforms and Control elsewhere. Sets `aria-keyshortcuts`. */
  readonly shortcut = input<string>()
  /** Connects a trigger outside the menu to the menu with this controller. */
  readonly controller: InputSignal<MenuTriggerProps["controller"]> = input()

  readonly #part = usePopupTrigger(
    MenuScope,
    "trigger",
    () => ({
      disabled: this.disabled(),
      focusableWhenDisabled: this.focusableWhenDisabled(),
      payload: this.payload(),
      shortcut: this.shortcut(),
    }),
    {
      controller: () => this.controller(),
      plain: plainButton(this.disabled, this.focusableWhenDisabled),
    }
  )
  /** The trigger's state, as a signal. */
  readonly state = computed<MenuTriggerState>(
    () => this.#part.state() ?? { open: false, disabled: !!this.disabled() }
  )
}

/**
 * An area that opens the menu at the pointer on a right-click or a long
 * press, and on Shift+F10. An area outside the menu connects through `controller`.
 * @experimental
 */
@Directive({
  selector: "[uiMenuContextTrigger]",
  exportAs: "uiMenuContextTrigger",
})
class MenuContextTrigger {
  /** Stops a right-click, a long press or Shift+F10 from opening the menu here. The browser's own menu shows instead. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Data for the content to render when this area opens the menu, like the row it belongs to. */
  readonly payload = input<unknown>()
  /** Connects an area outside the menu to the menu with this controller. */
  readonly controller: InputSignal<MenuContextTriggerProps["controller"]> =
    input()

  readonly #part = usePopupTrigger(
    MenuScope,
    "context-trigger",
    () => ({ disabled: this.disabled(), payload: this.payload() }),
    {
      controller: () => this.controller(),
      plain: () => ({}),
      feature: menuContextTrigger,
    }
  )
  /** The area's state, as a signal. */
  readonly state = computed<MenuContextTriggerState>(
    () => this.#part.state() ?? { open: false, disabled: !!this.disabled() }
  )
}

/**
 * The item that opens its submenu.
 * @experimental
 */
@Directive({ selector: "[uiMenuSubTrigger]", exportAs: "uiMenuSubTrigger" })
class MenuSubTrigger {
  /** Keeps the submenu trigger focusable but stops it from opening its submenu, as the menu pattern asks. Sets `data-disabled` and `aria-disabled`. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** The trigger's state, as a signal. */
  readonly state = usePart(inject(MenuScope).handle, "trigger", () => ({
    disabled: this.disabled(),
  })).state
}

/**
 * The popup that holds the items, positioned against the trigger that opened
 * it. `*uiMenuContent` renders it only while it's shown. Inside a `uiMenuSub`
 * it's the submenu's content, which `uiMenuSubContent` names too.
 * @experimental
 */
@Directive({
  selector: "[uiMenuContent], [uiMenuSubContent]",
  exportAs: "uiMenuContent, uiMenuSubContent",
  providers: [PopupScope],
})
class MenuContent {
  /** Which side of the trigger the menu opens on. Submenus open to the side, mirrored in right-to-left layouts. */
  readonly side: InputSignal<MenuContentProps["side"]> = input()
  /** How the menu lines up with the trigger along that side. */
  readonly align: InputSignal<MenuContentProps["align"]> = input()
  /** Gap between the trigger and the menu, in pixels. */
  readonly sideOffset = input(undefined, { transform: optionalNumber })
  /** Shift along the trigger, in pixels. Submenus default to lining up their first item with the trigger. */
  readonly alignOffset = input(undefined, { transform: optionalNumber })
  /** Space to keep from the viewport edges, in pixels. */
  readonly collisionPadding = input(undefined, { transform: optionalNumber })
  /** Space to keep between the arrow and the popup's corners, in pixels. */
  readonly arrowPadding = input(undefined, { transform: optionalNumber })
  /** Positions the popup against this instead of its trigger: an element, a CSS selector, a point like `{ x, y }`, or anything with `getBoundingClientRect()`. It's read on every check, so it can move. A controller's `open({ anchor })` wins for that open. */
  readonly anchor: InputSignal<MenuContentProps["anchor"]> = input()
  /** Where focus goes when the menu closes while focus is inside it. `"trigger"` returns it to the trigger and `"none"` leaves it. A CSS selector, an element or a function picks a specific element. */
  readonly finalFocus: InputSignal<MenuContentProps["finalFocus"]> = input()
  /** Whether the menu stays in the page, hidden, while closed. Its content keeps its state between opens. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  /** Renders the menu into this element instead of in place. A submenu stays inside its parent's popup. */
  readonly container = input<PopupContainer>()
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiMenuContent="{ side: 'bottom' }"`. */
  readonly uiMenuContent: StarInput<MenuContentProps> = input(undefined, {
    transform: starInputs<MenuContentProps>,
  })
  /** The same for a submenu: `*uiMenuSubContent="{ sideOffset: 4 }"`. */
  readonly uiMenuSubContent: StarInput<MenuContentProps> = input(undefined, {
    transform: starInputs<MenuContentProps>,
  })
  readonly #star = () => this.uiMenuContent() ?? this.uiMenuSubContent()

  readonly #menu = inject(MenuScope)
  /** The content's state, as a signal. */
  readonly state = usePopupContent(
    this.#menu,
    "content",
    () =>
      withStar(this.#star(), {
        side: this.side(),
        align: this.align(),
        sideOffset: this.sideOffset(),
        alignOffset: this.alignOffset(),
        collisionPadding: this.collisionPadding(),
        arrowPadding: this.arrowPadding(),
        anchor: this.anchor(),
        finalFocus: this.finalFocus(),
        keepMounted: this.keepMounted(),
      }),
    {
      container: () => this.container() ?? this.#star()?.container,
      inline: () => this.#menu.nested,
      viewport: !this.#menu.nested,
    }
  ).state

  static ngTemplateContextGuard(
    _directive: MenuContent,
    context: unknown
  ): context is { $implicit: MenuContentState } {
    return true
  }
}

/**
 * An action. Pressing it runs its `(select)` listener and the menu's
 * `(action)`, then closes the menu, unless `closeOnSelect` is false.
 * @experimental
 */
@Directive({
  selector: "[uiMenuItem]",
  exportAs: "uiMenuItem",
  providers: [MenuItemScope],
  outputs: ["select"],
})
class MenuItem {
  /** Passed to the menu's `(action)` when the item runs. */
  readonly value: InputSignal<MenuItemProps["value"]> = input()
  /** The text typeahead matches, when the content isn't plain text. It isn't the accessible name: use `aria-label` for that. */
  readonly label: InputSignal<MenuItemProps["label"]> = input()
  /** Keeps the item focusable but stops it from running, as the menu pattern asks. Sets `data-disabled` and `aria-disabled`. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Styles the item as dangerous, like Delete. Sets `data-destructive`. */
  readonly destructive = input(undefined, { transform: optionalBoolean })
  /** A keyboard shortcut like `"mod+n"`. A `uiMenuShortcut` inside shows `⌘N` on Apple platforms and `Ctrl+N` elsewhere, and the item sets `aria-keyshortcuts`. */
  readonly shortcut: InputSignal<MenuItemProps["shortcut"]> = input()
  /** Whether running the item closes the menu. */
  readonly closeOnSelect = input(undefined, { transform: optionalBoolean })
  /** Runs when the item is selected, by pointer or keyboard, with the event that selected it, or a new `select` Event when no DOM event did. Call `$event.event.preventDefault()` to keep the menu open and skip the menu's `(action)`. Pass a Promise to `$event.waitUntil()` to keep the item pending until it settles. */
  readonly select = new EventActionEmitter()
  /** The item's state, as a signal. */
  readonly state = usePart(inject(MenuScope).handle, "item", () => ({
    value: this.value(),
    label: this.label(),
    disabled: this.disabled(),
    destructive: this.destructive(),
    shortcut: this.shortcut(),
    closeOnSelect: this.closeOnSelect(),
    onSelect: this.select.handler(),
  })).state

  constructor() {
    inject(MenuItemScope, { self: true }).shortcut = this.shortcut
  }
}

/**
 * An item that checks and unchecks an option.
 * @experimental
 */
@Directive({
  selector: "[uiMenuCheckboxItem]",
  exportAs: "uiMenuCheckboxItem",
  providers: [MenuItemScope],
})
class MenuCheckboxItem {
  /** Identifies the item, in the menu's `(checkedChange)`. */
  readonly value = input.required<string>()
  /** The text typeahead matches, when the content isn't plain text. It isn't the accessible name: use `aria-label` for that. */
  readonly label = input<string>()
  /** Keeps the item focusable but stops it from toggling, as the menu pattern asks. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Whether the item is checked. Bind it with `[(checked)]` to control the item. */
  readonly checked = input(undefined, { transform: optionalBoolean })
  /** Whether the item starts checked, when uncontrolled. */
  readonly defaultChecked = input(undefined, { transform: optionalBoolean })
  /** Whether toggling closes the menu. */
  readonly closeOnSelect = input(undefined, { transform: optionalBoolean })
  /** Whether the item is checked, after a change that wasn't canceled. */
  readonly checkedChange = output<boolean>()
  /** Runs when the item wants to toggle. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeCheckedChange = output<MenuCheckboxItemCheckedChange>()

  readonly #menu = inject(MenuScope).handle
  /** The item's state, as a signal. */
  readonly state = usePart(this.#menu, "checkbox-item", () => ({
    value: this.value(),
    label: this.label(),
    disabled: this.disabled(),
    checked: this.checked(),
    defaultChecked: this.defaultChecked(),
    closeOnSelect: this.closeOnSelect(),
    onCheckedChange: emitChange(this.beforeCheckedChange, this.checkedChange),
  })).state

  constructor() {
    useFeature(this.#menu, menuCheckable)
    // The indicator shows a controlled `checked`, which core reads from the
    // item's props, so it reads it here to render again when it changes.
    inject(MenuItemScope, { self: true }).checkable = () => (
      this.checked(),
      { item: "checkbox-item", itemKey: this.value() }
    )
  }
}

/**
 * Radio items that share one value.
 * @experimental
 */
@Directive({ selector: "[uiMenuRadioGroup]", exportAs: "uiMenuRadioGroup" })
class MenuRadioGroup<Value extends string = string> {
  /** Identifies the group in the menu's `(valueChange)`. Defaults to a generated id. */
  readonly name = input<string>()
  /** The selected value. Bind it with `[(value)]` to control the group. `null` selects nothing. */
  readonly value = input<Value | null>()
  /** The value selected at first, when uncontrolled. */
  readonly defaultValue = input<Value | null>()
  /** The selected value, after a change that wasn't canceled. */
  readonly valueChange = output<Value>()
  /** Runs when the selection wants to change. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeValueChange = output<MenuRadioGroupValueChange<Value>>()

  readonly #menu = inject(MenuScope).handle
  readonly #generated = useId()
  /** The name its items and label share: `name`, or a generated id. */
  readonly group = computed(() => this.name() ?? this.#generated)
  /** The group's state, as a signal. */
  readonly state = usePart(this.#menu, "radio-group", () => ({
    id: this.group(),
    name: this.group(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitTypedChange(this.beforeValueChange, this.valueChange),
  })).state

  constructor() {
    useFeature(this.#menu, menuCheckable)
  }
}

/**
 * An item in a `uiMenuRadioGroup`. Pressing it checks its value.
 * @experimental
 */
@Directive({
  selector: "[uiMenuRadioItem]",
  exportAs: "uiMenuRadioItem",
  providers: [MenuItemScope],
})
class MenuRadioItem {
  /** Selected in the group when the item is chosen. */
  readonly value = input.required<string>()
  /** The text typeahead matches, when the content isn't plain text. It isn't the accessible name: use `aria-label` for that. */
  readonly label = input<string>()
  /** Keeps the item focusable but stops it from being chosen, as the menu pattern asks. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Whether choosing the item closes the menu. */
  readonly closeOnSelect = input(undefined, { transform: optionalBoolean })

  readonly #menu = inject(MenuScope).handle
  readonly #group = inject(MenuRadioGroup)
  // Whether the item is checked follows the group's controlled value, which
  // core reads from the group's props, so the item reads it to render again.
  /** The item's state, as a signal. */
  readonly state = usePart(
    this.#menu,
    "radio-item",
    () => (
      this.#group.value(),
      {
        group: this.#group.group(),
        value: this.value(),
        label: this.label(),
        disabled: this.disabled(),
        closeOnSelect: this.closeOnSelect(),
      }
    )
  ).state

  constructor() {
    useFeature(this.#menu, menuCheckable)
    inject(MenuItemScope, { self: true }).checkable = () => (
      this.#group.value(),
      {
        item: "radio-item",
        itemKey: this.value(),
        group: this.#group.group(),
      }
    )
  }
}

/**
 * The check or dot inside a checkbox or radio item. `*uiMenuItemIndicator`
 * renders it only while the item is checked.
 * @experimental
 */
@Directive({
  selector: "[uiMenuItemIndicator]",
  exportAs: "uiMenuItemIndicator",
})
class MenuItemIndicator {
  /** Whether the indicator stays in the page while its item is unchecked, so it can be styled or animated in both states. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  readonly #menu = inject(MenuScope).handle
  readonly #item = inject(MenuItemScope)
  readonly #id = useId()
  /** The indicator's state, as a signal. */
  readonly state = usePart(this.#menu, "item-indicator", () => ({
    id: this.#id,
    item: "checkbox-item" as const,
    itemKey: "",
    ...this.#item.checkable(),
    keepMounted: this.keepMounted(),
  })).state

  constructor() {
    useFeature(this.#menu, menuCheckable)
  }

  static ngTemplateContextGuard(
    _directive: MenuItemIndicator,
    context: unknown
  ): context is { $implicit: ReturnType<MenuItemIndicator["state"]> } {
    return true
  }
}

/**
 * An icon inside an item or a submenu trigger. Screen readers and typeahead
 * skip it, and `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiMenuItemIcon]", exportAs: "uiMenuItemIcon" })
class MenuItemIcon {
  /** Flips the icon horizontally in right-to-left text, for icons that point a way, like arrows and chevrons. */
  readonly mirror = input(undefined, { transform: optionalBoolean })

  readonly #menu = inject(MenuScope).handle
  readonly #id = useId()
  /** The icon's state, as a signal. */
  readonly state = usePart(this.#menu, "item-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
  })).state

  constructor() {
    useFeature(this.#menu, menuItemIcons)
  }
}

/**
 * A group of items, named by its `uiMenuGroupLabel`.
 * @experimental
 */
@Directive({ selector: "[uiMenuGroup]", exportAs: "uiMenuGroup" })
class MenuGroup {
  /** The id its label shares. */
  readonly id = useId()
  /** The group's state, as a signal. */
  readonly state = usePart(inject(MenuScope).handle, "group", () => ({
    id: this.id,
  })).state
}

/**
 * The name of the group or radio group it sits in.
 * @experimental
 */
@Directive({ selector: "[uiMenuGroupLabel]", exportAs: "uiMenuGroupLabel" })
class MenuGroupLabel {
  readonly #radioGroup = inject(MenuRadioGroup, { optional: true })
  readonly #group = inject(MenuGroup, { optional: true })
  readonly #name = () => this.#radioGroup?.group() ?? this.#group?.id ?? ""
  /** The label's state, as a signal. */
  readonly state = usePart(inject(MenuScope).handle, "group-label", () => ({
    id: this.#name(),
    group: this.#name(),
  })).state
}

/**
 * A line between groups of items.
 * @experimental
 */
@Directive({ selector: "[uiMenuSeparator]", exportAs: "uiMenuSeparator" })
class MenuSeparator {
  /** The separator's state, as a signal. */
  readonly state = usePart(inject(MenuScope).handle, "separator").state
}

/**
 * Shows the keys of an item's shortcut, like `⌘S`, inside the item. Left
 * empty, it shows the item's `shortcut` for this platform. Screen readers skip it.
 * @experimental
 */
@Directive({ selector: "[uiMenuShortcut]", exportAs: "uiMenuShortcut" })
class MenuShortcut {
  readonly #item = inject(MenuItemScope, { optional: true })
  /** The shortcut's state, as a signal. */
  readonly state = usePart(inject(MenuScope).handle, "shortcut").state

  constructor() {
    // The server can't know the platform, so the keys settle once the page renders.
    const apple = signal(false)
    afterNextRender(() => apple.set(isApple()))
    useText(() => {
      const shortcut = this.#item?.shortcut()
      return shortcut ? formatShortcut(shortcut, apple()) : undefined
    })
  }
}

const entryOf = (entry: MenuDataItem | string) =>
  (typeof entry === "string"
    ? { value: entry, label: entry }
    : entry) as MenuDataItem

/**
 * Renders a data menu's items as bare parts, inside your content: its own
 * `items`, or the menu's. Its element only holds them and takes no space.
 * @experimental
 */
@Component({
  selector: "[uiMenuItems]",
  exportAs: "uiMenuItems",
  host: { style: "display: contents" },
  imports: [
    MenuCheckboxItem,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItem,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuShortcut,
    MenuSub,
    MenuSubTrigger,
  ],
  template: `
    @for (item of entries(); track key(item, $index)) {
      @switch (item.type) {
        @case ("separator") {
          <div uiMenuSeparator></div>
        }
        @case ("group") {
          <div uiMenuGroup>
            @if (item.label) {
              <div uiMenuGroupLabel>{{ item.label }}</div>
            }
            <div uiMenuItems [items]="item.items"></div>
          </div>
        }
        @case ("checkbox") {
          <div
            uiMenuCheckboxItem
            [value]="item.value"
            [disabled]="item.disabled"
            [checked]="item.checked"
            [defaultChecked]="item.defaultChecked"
            [closeOnSelect]="item.closeOnSelect"
          >
            {{ item.label }}
          </div>
        }
        @case ("radio-group") {
          <div
            uiMenuRadioGroup
            [name]="item.name"
            [value]="item.value"
            [defaultValue]="item.defaultValue"
          >
            @if (item.label) {
              <div uiMenuGroupLabel>{{ item.label }}</div>
            }
            @for (radio of item.items; track radio.value) {
              <div
                uiMenuRadioItem
                [value]="radio.value"
                [disabled]="radio.disabled"
              >
                {{ radio.label }}
              </div>
            }
          </div>
        }
        @case ("submenu") {
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger [disabled]="item.disabled">
              {{ item.label }}
            </div>
            <div *uiMenuSubContent>
              <div uiMenuItems [items]="item.items"></div>
            </div>
          </ng-container>
        }
        @default {
          <div
            uiMenuItem
            [value]="item.value"
            [disabled]="item.disabled"
            [shortcut]="item.shortcut"
            [closeOnSelect]="item.closeOnSelect"
            [destructive]="item.destructive"
          >
            {{ item.label }}
            @if (item.shortcut) {
              <span uiMenuShortcut></span>
            }
          </div>
        }
      }
    }
  `,
})
class MenuItems {
  /** The entries to render. Without it, the menu's `items`. */
  readonly items = input<MenuData>()

  readonly #menu = inject(Menu, { optional: true })
  protected readonly entries = computed(() =>
    (this.items() ?? this.#menu?.items() ?? []).map(entryOf)
  )

  protected key(item: MenuDataItem, index: number) {
    switch (item.type) {
      case undefined:
      case "item":
      case "checkbox":
        return item.value
      case "radio-group":
        return item.name
      default:
        return `${item.type}-${index}`
    }
  }
}

export { createMenuController } from "@ui-sdk/core/menu"
export type {
  MenuApi,
  MenuCheckboxItemProps,
  MenuCheckboxItemState,
  MenuActionDetails,
  MenuCheckedChangeDetails,
  MenuCheckedChangeReason,
  MenuContentProps,
  MenuContentState,
  MenuContextTriggerProps,
  MenuContextTriggerState,
  MenuController,
  MenuData,
  MenuDataItem,
  MenuDismissReason,
  MenuFinalFocus,
  MenuItemIconProps,
  MenuItemIconState,
  MenuItemIndicatorProps,
  MenuItemIndicatorState,
  MenuItemProps,
  MenuItemState,
  MenuOpenChangeReason,
  MenuOpenOptions,
  MenuOptions,
  MenuPayloadChangeReason,
  MenuPrimitive,
  MenuRadioGroupProps,
  MenuRadioGroupState,
  MenuRadioItemProps,
  MenuRadioItemState,
  MenuSubTriggerProps,
  MenuTriggerProps,
  MenuTriggerState,
  MenuValueChangeDetails,
  MenuValueChangeReason,
} from "@ui-sdk/core/menu"

export {
  Menu,
  type MenuAction,
  MenuCheckboxItem,
  type MenuCheckboxItemCheckedChange,
  type MenuCheckedChange,
  MenuContent,
  MenuContextTrigger,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuItemIndicator,
  MenuItems,
  type MenuItemSelect,
  type MenuOpenChange,
  type MenuPayloadChange,
  MenuRadioGroup,
  type MenuRadioGroupValueChange,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuContent as MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  type MenuValueChange,
}
