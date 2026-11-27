import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  Injectable,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  triggerMenu,
  type TriggerMenuContentProps,
  type TriggerMenuContentState,
  type TriggerMenuHintState,
  type TriggerMenuItemProps,
  type TriggerMenuOptions,
  type TriggerMenuSelectDetails,
} from "@ui-sdk/core/trigger-menu"
import {
  optionalBoolean,
  optionalNumber,
  type StarInput,
  starInputs,
  withStar,
} from "./inputs.ts"
import { EditorContext } from "./editor-context.ts"
import { emitChange, ListenedEmitter } from "./outputs.ts"
import {
  PopupRoot,
  PopupScope,
  usePopupContent,
  usePopupRoot,
} from "./popup.ts"
import {
  useId,
  usePart,
  usePrimitive,
  type PopupContainer,
} from "./use-primitive.ts"

import type {
  TriggerMenuData,
  TriggerMenuDataItem,
} from "@ui-sdk/core/trigger-menu"
import { useFieldControl } from "./field-context.ts"
import { listEntry, useEmptyMessage } from "./list-context.ts"
import { useBlank } from "./text.ts"
/**
 * What `(beforeOpenChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type TriggerMenuOpenChange = Parameters<
  NonNullable<TriggerMenuOptions["onOpenChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<TriggerMenuOptions["onOpenChange"]>>[0]
}

/**
 * What `(beforeQueryChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type TriggerMenuQueryChange = Parameters<
  NonNullable<TriggerMenuOptions["onQueryChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<TriggerMenuOptions["onQueryChange"]>>[0]
}

/**
 * What `(select)` emits: the chosen item's value and what came with it. `preventDefault()` skips the default insertion, and `waitUntil(promise)` inserts the token as pending until the Promise settles.
 * @experimental
 */
type TriggerMenuSelect<T = any> = TriggerMenuSelectDetails<T> & {
  /** The chosen item's value. */
  value: T
}

@Injectable()
class TriggerMenuScope extends PopupRoot<typeof triggerMenu> {}

/**
 * Suggestions opened by a trigger like `@` or `/` in text. Inside a `uiTokenInput` it uses that editor; otherwise put `uiTriggerMenuInput` on a text field inside it, or pass `editor`. It goes on an `<ng-container>` or any element around its parts.
 * @experimental
 */
@Directive({
  selector: "[uiTriggerMenu]",
  exportAs: "uiTriggerMenu",
  providers: [TriggerMenuScope],
  outputs: ["select"],
})
class TriggerMenu {
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The texts that open the menu, and what each one lists. */
  readonly triggers = input.required<TriggerMenuOptions["triggers"]>()
  /** The editor the menu reads and writes, for editors without a part of their own. `uiTriggerMenuInput` and a `uiTokenInput` around the menu set it for you. */
  readonly editor: InputSignal<TriggerMenuOptions["editor"]> = input()
  /** Whether the menu is open. Bind it with `[(open)]` to control it; it shows only while there's a match. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly openChange = output<TriggerMenuOpenChange["value"]>()
  /** Runs when the menu wants to open or close. `$event.trigger` says which trigger, and `$event.cancel()` stops it. */
  readonly beforeOpenChange = output<TriggerMenuOpenChange>()
  /** Runs once the menu has finished opening or closing, after any animation. */
  readonly openChangeComplete =
    output<
      Parameters<NonNullable<TriggerMenuOptions["onOpenChangeComplete"]>>[0]
    >()
  /** The new value, after a change that wasn't canceled. */
  readonly queryChange = output<TriggerMenuQueryChange["value"]>()
  /** Runs when the text after the trigger changes. `$event.argument` names the argument being typed. */
  readonly beforeQueryChange = output<TriggerMenuQueryChange>()
  /** Runs when an item, with every required argument, is chosen. The default insertion follows unless `$event.preventDefault()`. Pass a Promise to `$event.waitUntil()` and a pending token is inserted at once. */
  readonly select = new ListenedEmitter<TriggerMenuSelect>()
  /** What screen readers hear once a `(select)` Promise has been pending for a second. An empty string says nothing. */
  readonly pendingAnnouncement: InputSignal<
    TriggerMenuOptions["pendingAnnouncement"]
  > = input()
  /** Whether items that come from outside are loading or failed, for the status and empty parts. */
  readonly status: InputSignal<TriggerMenuOptions["status"]> = input()
  /** Whether the first match is highlighted so Enter and Tab choose it. */
  readonly autoHighlight = input(undefined, { transform: optionalBoolean })
  /** Whether arrow keys wrap from the last item to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Reopens a match dismissed with Escape, with the caret in it. */
  readonly shortcut: InputSignal<TriggerMenuOptions["shortcut"]> = input()
  /** Opens, closes and inserts from anywhere. Create one with `createTriggerMenuController()`. */
  readonly controller: InputSignal<TriggerMenuOptions["controller"]> = input()
  /** Whether Escape, an outside press, focus or the window leaving and the screen reader's escape gesture can close the menu. Choosing an item, moving the caret out of the match and the controller always can. */
  readonly dismissible = input(undefined, { transform: optionalBoolean })
  /** Runs when `dismissible` refused a dismissal made on purpose: Escape, an outside press or the screen reader's escape. Focus or the window leaving is refused without it. */
  readonly dismissAttempt =
    output<Parameters<NonNullable<TriggerMenuOptions["onDismissAttempt"]>>[0]>()
  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()

  readonly #editor = inject(EditorContext, { optional: true })
  readonly #select = (value: any, details: TriggerMenuSelectDetails<any>) =>
    this.select.emit(Object.assign(details, { value }))
  readonly handle = usePrimitive(triggerMenu, () => ({
    debug: this.debug(),
    triggers: this.triggers(),
    editor: this.editor() ?? this.#editor?.(),
    open: this.open(),
    onOpenChange: emitChange(this.beforeOpenChange, this.openChange),
    onOpenChangeComplete: (value) => this.openChangeComplete.emit(value),
    onQueryChange: emitChange(this.beforeQueryChange, this.queryChange),
    onSelect: this.select.listened() ? this.#select : undefined,
    pendingAnnouncement: this.pendingAnnouncement(),
    status: this.status(),
    autoHighlight: this.autoHighlight(),
    loop: this.loop(),
    shortcut: this.shortcut(),
    controller: this.controller(),
    dismissible: this.dismissible(),
    onDismissAttempt: (value) => this.dismissAttempt.emit(value),
  }))

  constructor() {
    usePopupRoot(
      TriggerMenuScope,
      { handle: this.handle, container: this.container },
      () => this.controller()
    )
  }
}

/**
 * The text field the menu suggests into: a `<textarea>` or an `<input>`. Inside a field, it's the field's control.
 * @experimental
 */
@Directive({ selector: "[uiTriggerMenuInput]", exportAs: "uiTriggerMenuInput" })
class TriggerMenuInput {
  /** The input's state, as a signal. */
  readonly state = usePart(
    inject(TriggerMenuScope).handle,
    "input",
    undefined,
    { joined: useFieldControl()?.joined }
  ).state
}

/**
 * The popup that holds the suggestions, anchored at the caret. `*uiTriggerMenuContent` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiTriggerMenuContent]",
  exportAs: "uiTriggerMenuContent",
  providers: [PopupScope],
})
class TriggerMenuContent {
  /** Which side of the trigger the list opens on. */
  readonly side: InputSignal<TriggerMenuContentProps["side"]> = input()
  /** How the list lines up with the trigger along that side. */
  readonly align: InputSignal<TriggerMenuContentProps["align"]> = input()
  /** Gap between the line of text and the list, in pixels. */
  readonly sideOffset = input(undefined, { transform: optionalNumber })
  /** Shift along the text, in pixels. */
  readonly alignOffset = input(undefined, { transform: optionalNumber })
  /** Space to keep from the viewport edges, in pixels. */
  readonly collisionPadding = input(undefined, { transform: optionalNumber })
  /** Space to keep between the arrow and the popup's corners, in pixels. */
  readonly arrowPadding = input(undefined, { transform: optionalNumber })
  /** Positions the popup against this instead of its trigger: an element, a CSS selector, a point like `{ x, y }`, or anything with `getBoundingClientRect()`. It's read on every check, so it can move. A controller's `open({ anchor })` wins for that open. */
  readonly anchor: InputSignal<TriggerMenuContentProps["anchor"]> = input()
  /** Whether the list stays in the page, hidden, while closed. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiTriggerMenuContent="{ side: 'bottom' }"`. */
  readonly uiTriggerMenuContent: StarInput<TriggerMenuContentProps> = input(
    undefined,
    { transform: starInputs<TriggerMenuContentProps> }
  )

  /** The part's state, as a signal. */
  readonly state = usePopupContent(
    inject(TriggerMenuScope),
    "content",
    () =>
      withStar(this.uiTriggerMenuContent(), {
        side: this.side(),
        align: this.align(),
        sideOffset: this.sideOffset(),
        alignOffset: this.alignOffset(),
        collisionPadding: this.collisionPadding(),
        arrowPadding: this.arrowPadding(),
        anchor: this.anchor(),
        keepMounted: this.keepMounted(),
      }),
    {
      container: () =>
        this.container() ?? this.uiTriggerMenuContent()?.container,
    }
  ).state

  static ngTemplateContextGuard(
    _directive: TriggerMenuContent,
    context: unknown
  ): context is { $implicit: TriggerMenuContentState } {
    return true
  }
}

/**
 * A suggestion. Choosing it inserts it into the text.
 * @experimental
 */
@Directive({
  selector: "[uiTriggerMenuItem]",
  exportAs: "uiTriggerMenuItem",
  outputs: ["select"],
})
class TriggerMenuItem {
  /** What `(select)` emits when the item is chosen. */
  readonly value = input.required<TriggerMenuItemProps<any>["value"]>()
  /** The text inserted and matched, when the content isn't plain text. */
  readonly label: InputSignal<TriggerMenuItemProps["label"]> = input()
  /** More words filtering matches. */
  readonly keywords: InputSignal<TriggerMenuItemProps["keywords"]> = input()
  /** Keeps the item from being chosen. It can still be highlighted, as the listbox pattern asks. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Runs before the menu's `(select)`. `$event.preventDefault()` skips the default insertion. */
  readonly select = new ListenedEmitter<TriggerMenuSelect>()

  readonly #menu = inject(TriggerMenuScope).handle
  readonly #group = inject(TriggerMenuGroup, { optional: true })
  readonly #select = (value: any, details: TriggerMenuSelectDetails<any>) =>
    this.select.emit(Object.assign(details, { value }))
  /** The item's state, as a signal. */
  readonly state = usePart(this.#menu, "item", () => ({
    id: this.#menu.api.internal.keyOf(this.value()),
    value: this.value(),
    label: this.label(),
    keywords: this.keywords(),
    disabled: this.disabled(),
    onSelect: this.select.listened() ? this.#select : undefined,
    group: this.#group?.id,
  })).state
}

/**
 * An icon inside a suggestion. Screen readers, typeahead and filtering skip it, and `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({
  selector: "[uiTriggerMenuItemIcon]",
  exportAs: "uiTriggerMenuItemIcon",
})
class TriggerMenuItemIcon {
  /** Flips the icon horizontally in right-to-left text, for icons that point a way, like arrows and chevrons. Icons that picture a thing, like a clock or a check, stay as they are. */
  readonly mirror = input(undefined, { transform: optionalBoolean })

  readonly #id = useId()
  /** The icon's state, as a signal. */
  readonly state = usePart(
    inject(TriggerMenuScope).handle,
    "item-icon",
    () => ({ id: this.#id, mirror: this.mirror() })
  ).state
}

/**
 * A group of items, named by its `TriggerMenuGroupLabel`.
 * @experimental
 */
@Directive({ selector: "[uiTriggerMenuGroup]", exportAs: "uiTriggerMenuGroup" })
class TriggerMenuGroup {
  /** The id the parts inside it share. */
  readonly id = useId()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(TriggerMenuScope).handle, "group", () => ({
    id: this.id,
  })).state
}

/**
 * The group's heading, which names the group.
 * @experimental
 */
@Directive({
  selector: "[uiTriggerMenuGroupLabel]",
  exportAs: "uiTriggerMenuGroupLabel",
})
class TriggerMenuGroupLabel {
  readonly #group = inject(TriggerMenuGroup)
  /** The part's state, as a signal. */
  readonly state = usePart(
    inject(TriggerMenuScope).handle,
    "group-label",
    () => ({ id: this.#group.id, group: this.#group.id })
  ).state
}

/**
 * A line between items or groups, hidden from screen readers.
 * @experimental
 */
@Directive({
  selector: "[uiTriggerMenuSeparator]",
  exportAs: "uiTriggerMenuSeparator",
})
class TriggerMenuSeparator {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(TriggerMenuScope).handle, "separator").state
}

/**
 * Shown while no item matches. Having it in the menu keeps the menu open with no matches.
 * @experimental
 */
@Directive({ selector: "[uiTriggerMenuEmpty]", exportAs: "uiTriggerMenuEmpty" })
class TriggerMenuEmpty {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(TriggerMenuScope).handle, "empty", () => ({
    stash: true,
  })).state

  constructor() {
    useEmptyMessage(() => this.state().empty)
  }
}

/**
 * A polite status, outside the popup. Left empty, it says the count and the keys once typing pauses.
 * @experimental
 */
@Directive({
  selector: "[uiTriggerMenuStatus]",
  exportAs: "uiTriggerMenuStatus",
})
class TriggerMenuStatus {
  readonly #blank = useBlank()
  /** The part's state, as a signal. */
  readonly state = usePart(inject(TriggerMenuScope).handle, "status", () => ({
    text: this.#blank(),
  })).state
}

/**
 * Ghost text at the caret for the arguments still to type. Left empty, it shows the hints. `*uiTriggerMenuHint="let hint"` renders it only while there's a hint, with your own content.
 * @experimental
 */
@Directive({ selector: "[uiTriggerMenuHint]", exportAs: "uiTriggerMenuHint" })
class TriggerMenuHint {
  readonly #blank = useBlank()
  /** The part's state, as a signal. */
  readonly state = usePart(inject(TriggerMenuScope).handle, "hint", () => ({
    text: this.#blank(),
  })).state

  static ngTemplateContextGuard(
    _directive: TriggerMenuHint,
    context: unknown
  ): context is { $implicit: TriggerMenuHintState } {
    return true
  }
}

/**
 * Renders data items as bare parts, inside your list: its own `items`, or
 * the current trigger's that match. Its element only holds them and takes no space.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiTriggerMenuItems]",
  exportAs: "uiTriggerMenuItems",
  host: { style: "display: contents" },
  imports: [
    TriggerMenuGroup,
    TriggerMenuGroupLabel,
    TriggerMenuItem,
    TriggerMenuSeparator,
  ],
  template: `
    @for (entry of entries(); track key(entry, $index)) {
      @switch (entry.type) {
        @case ("separator") {
          <div uiTriggerMenuSeparator></div>
        }
        @case ("group") {
          <div uiTriggerMenuGroup>
            @if (entry.label) {
              <div uiTriggerMenuGroupLabel>{{ entry.label }}</div>
            }
            <div uiTriggerMenuItems [items]="entry.items"></div>
          </div>
        }
        @case ("item") {
          <div
            uiTriggerMenuItem
            [value]="entry.value"
            [label]="entry.label"
            [keywords]="entry.keywords"
            [disabled]="entry.disabled"
          >
            {{ entry.label }}
          </div>
        }
      }
    }
  `,
})
class TriggerMenuItems {
  /** The entries to render. Without it, the current trigger's items that match. */
  readonly items = input<TriggerMenuData<any>>()

  readonly #menu = inject(TriggerMenuScope).handle
  readonly #list = inject(TriggerMenuList, { optional: true })
  protected readonly entries = computed(() =>
    (this.items() ?? this.#list?.state().items ?? []).map((entry) =>
      listEntry<any, TriggerMenuDataItem<any>>(entry)
    )
  )

  protected key(
    entry: ReturnType<TriggerMenuItems["entries"]>[number],
    index: number
  ) {
    return entry.type === "item"
      ? this.#menu.api.internal.keyOf(entry.value)
      : `${entry.type}-${index}`
  }
}

/**
 * The listbox. Left empty, it renders the current trigger's items, filtered.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiTriggerMenuList]",
  exportAs: "uiTriggerMenuList",
  imports: [TriggerMenuItems],
  template: `<ng-content><div uiTriggerMenuItems></div></ng-content>`,
})
class TriggerMenuList {
  /** The list's state, as a signal. Its `items` are the visible data items. */
  readonly state = usePart(inject(TriggerMenuScope).handle, "list").state
}

export {
  createTriggerMenuController,
  textFieldAdapter,
} from "@ui-sdk/core/trigger-menu"
export type {
  EditorChange,
  EditorReplaceOptions,
  ListFilter,
  ListItem,
  ListSeparator,
  TextEditorAdapter,
  TextRange,
  TextRect,
  Token,
  TokenInsert,
  TriggerAfter,
  TriggerArgument,
  TriggerBoundary,
  TriggerDefinition,
  TriggerItemsLoader,
  TriggerMatch,
  TriggerMenuApi,
  TriggerMenuChangeOptions,
  TriggerMenuContentProps,
  TriggerMenuContentState,
  TriggerMenuController,
  TriggerMenuData,
  TriggerMenuDataGroup,
  TriggerMenuDataItem,
  TriggerMenuDismissReason,
  TriggerMenuEmptyState,
  TriggerMenuHintState,
  TriggerMenuInputState,
  TriggerMenuItemIconProps,
  TriggerMenuItemIconState,
  TriggerMenuItemProps,
  TriggerMenuItemState,
  TriggerMenuOpenChangeReason,
  TriggerMenuOptions,
  TriggerMenuPrimitive,
  TriggerMenuQueryChangeReason,
  TriggerMenuSelectDetails,
  TriggerMenuStatusState,
  TriggerRule,
} from "@ui-sdk/core/trigger-menu"

export {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuGroup,
  TriggerMenuGroupLabel,
  TriggerMenuHint,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuItemIcon,
  TriggerMenuList,
  type TriggerMenuOpenChange,
  type TriggerMenuQueryChange,
  type TriggerMenuSelect,
  TriggerMenuSeparator,
  TriggerMenuStatus,
  TriggerMenuItems,
}
