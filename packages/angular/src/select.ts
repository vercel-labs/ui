import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Injectable,
  computed,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  select,
  type ListData,
  type SelectClearState,
  type SelectSelectAllState,
  type SelectValueState,
  type SelectContentProps,
  type SelectContentState,
  type SelectItemIndicatorState,
  type SelectItemProps,
  type SelectOptions,
  type SelectTriggerProps,
  type SelectTriggerState,
  type SelectValueProps,
} from "@ui-sdk/core/select"
import {
  optionalBoolean,
  optionalNumber,
  type StarInput,
  starInputs,
  withStar,
} from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
import { useFormInputs, useOwedFormInputs } from "./native-input.ts"
import {
  plainButton,
  PopupRoot,
  PopupScope,
  PopupTriggerScope,
  usePopupContent,
  usePopupRoot,
  usePopupTrigger,
  useTriggerPart,
} from "./popup.ts"
import {
  useFeature,
  useId,
  usePart,
  usePrimitive,
  useStore,
  type PopupContainer,
} from "./use-primitive.ts"
import { HostAttributeToken } from "@angular/core"
import {
  selectAllKey,
  selectItemIcons,
  selectSelectAll,
} from "@ui-sdk/core/renderer"
import { listEntry, useEmptyMessage, useMarkedText } from "./list-context.ts"
import { useText } from "./text.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type SelectValueChange<Value = any> = Parameters<
  NonNullable<SelectOptions<any, boolean>["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Value
}

/**
 * What `(beforeOpenChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type SelectOpenChange = Parameters<
  NonNullable<SelectOptions<any, boolean>["onOpenChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<SelectOptions<any, boolean>["onOpenChange"]>>[0]
}

/**
 * What `(beforeQueryChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type SelectQueryChange = Parameters<
  NonNullable<SelectOptions<any, boolean>["onQueryChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<
    NonNullable<SelectOptions<any, boolean>["onQueryChange"]>
  >[0]
}

/**
 * What `(highlight)` emits: the value and what came with it.
 * @experimental
 */
type SelectHighlight = Parameters<
  NonNullable<SelectOptions<any, boolean>["onHighlight"]>
>[1] & {
  /** The value it reports. */
  value: Parameters<NonNullable<SelectOptions<any, boolean>["onHighlight"]>>[0]
}

@Injectable()
class SelectScope extends PopupRoot<typeof select> {}

@Injectable()
class SelectTriggerScope extends PopupTriggerScope<typeof select> {}

/**
 * Picks one value, or several with `multiple`, from a list in a popup.
 * @experimental
 */
@Directive({
  selector: "[uiSelect]",
  exportAs: "uiSelect",
  providers: [SelectScope],
})
class Select<Value = any> {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The selected values. Bind it with `[(value)]` to control the select. */
  readonly value = input<Value>()
  /** The values selected at first, when uncontrolled. A form reset returns to them. */
  readonly defaultValue = input<Value>()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<Value>()
  /** Runs when a user, a form reset or a controller wants to change the value. `$event.cancel()` stops it. */
  readonly beforeValueChange = output<SelectValueChange<Value>>()
  /** Whether the list is open. Bind it with `[(open)]` to control it. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** Whether the list starts open, when uncontrolled. */
  readonly defaultOpen = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly openChange = output<SelectOpenChange["value"]>()
  /** Runs when the list wants to open or close. `$event.cancel()` stops it. */
  readonly beforeOpenChange = output<SelectOpenChange>()
  /** Runs once the list has finished opening or closing, after any animation. */
  readonly openChangeComplete =
    output<
      Parameters<
        NonNullable<SelectOptions<any, boolean>["onOpenChangeComplete"]>
      >[0]
    >()
  /** Whether several items can be selected. The value is then a list. */
  readonly multiple = input(undefined, { transform: optionalBoolean })
  /** The items as data. A `uiSelectItems` inside renders them. */
  readonly items: InputSignal<SelectOptions<any, boolean>["items"]> = input()
  /** What the list shows while the search is empty, like recent choices. */
  readonly emptyItems: InputSignal<SelectOptions<any, boolean>["emptyItems"]> =
    input()
  /** The search text. Bind it with `[(query)]` to control it. */
  readonly query: InputSignal<SelectOptions<any, boolean>["query"]> = input()
  /** The search text at first, when uncontrolled. */
  readonly defaultQuery: InputSignal<
    SelectOptions<any, boolean>["defaultQuery"]
  > = input()
  /** The new value, after a change that wasn't canceled. */
  readonly queryChange = output<SelectQueryChange["value"]>()
  /** Runs when the search text wants to change. `$event.cancel()` stops it. */
  readonly beforeQueryChange = output<SelectQueryChange>()
  /** How the search matches items. */
  readonly filter: InputSignal<SelectOptions<any, boolean>["filter"]> = input()
  /** Whether items are loading, for async options. */
  readonly status: InputSignal<SelectOptions<any, boolean>["status"]> = input()
  /** Runs when the list is scrolled near its end, for async options. */
  readonly loadMore = output<void>()
  /** What screen readers hear when the results change. */
  readonly announcement: InputSignal<
    SelectOptions<any, boolean>["announcement"]
  > = input()
  /** What the trigger shows while nothing is selected. */
  readonly placeholder: InputSignal<
    SelectOptions<any, boolean>["placeholder"]
  > = input()
  /** The string an item's value submits as and is identified by, for object values. */
  readonly itemToValue: InputSignal<
    SelectOptions<any, boolean>["itemToValue"]
  > = input()
  /** The label of a value whose item isn't rendered. */
  readonly itemToLabel: InputSignal<
    SelectOptions<any, boolean>["itemToLabel"]
  > = input()
  /** Whether an item's value is the selected value, for object values that aren't the same object. */
  readonly isItemEqualToValue: InputSignal<
    SelectOptions<any, boolean>["isItemEqualToValue"]
  > = input()
  /** Runs when the highlight moves to another item. */
  readonly highlight = output<SelectHighlight>()
  /** Whether arrow keys wrap from the last item to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Keeps focus on the trigger while the list is open, which points at the highlighted item. */
  readonly virtualFocus = input(undefined, { transform: optionalBoolean })
  /** Whether the page behind the list is inert, or only shielded from the pointer. */
  readonly modal: InputSignal<SelectOptions<any, boolean>["modal"]> = input()
  /** How the list presents: a popover, a sheet, or `"auto"` for a sheet on small touch screens. */
  readonly presentation: InputSignal<
    SelectOptions<any, boolean>["presentation"]
  > = input()
  /** Disables the select like a native control. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps the select focusable and its value submitted, but stops changes. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Blocks form submission until a value is selected. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name the value submits under. */
  readonly name: InputSignal<SelectOptions<any, boolean>["name"]> = input()
  /** The id of a form to belong to, when the select isn't inside that form. */
  readonly form: InputSignal<SelectOptions<any, boolean>["form"]> = input()
  /** The browser's autofill hint. */
  readonly autoComplete: InputSignal<
    SelectOptions<any, boolean>["autoComplete"]
  > = input()
  /** Reads and sets the select from anywhere, and connects triggers outside it. Create one with `createSelectController()`. */
  readonly controller: InputSignal<SelectOptions<any, boolean>["controller"]> =
    input()
  /** Whether Escape, an outside press, focus or the window leaving, Android's back gesture, the screen reader's escape gesture and a swipe on a sheet can close the list. The trigger, items and the controller always can. */
  readonly dismissible = input(undefined, { transform: optionalBoolean })
  /** Runs when `dismissible` refused a dismissal made on purpose: Escape, an outside press, back, the screen reader's escape or a swipe. Focus or the window leaving is refused without it. */
  readonly dismissAttempt =
    output<
      Parameters<
        NonNullable<SelectOptions<any, boolean>["onDismissAttempt"]>
      >[0]
    >()
  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()

  readonly handle = usePrimitive(select, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    onOpenChange: emitChange(this.beforeOpenChange, this.openChange),
    onOpenChangeComplete: (value) => this.openChangeComplete.emit(value),
    multiple: this.multiple(),
    items: this.items(),
    emptyItems: this.emptyItems(),
    query: this.query(),
    defaultQuery: this.defaultQuery(),
    onQueryChange: emitChange(this.beforeQueryChange, this.queryChange),
    filter: this.filter(),
    status: this.status(),
    onLoadMore: () => this.loadMore.emit(),
    announcement: this.announcement(),
    placeholder: this.placeholder(),
    itemToValue: this.itemToValue(),
    itemToLabel: this.itemToLabel(),
    isItemEqualToValue: this.isItemEqualToValue(),
    onHighlight: (value, details) => this.highlight.emit({ ...details, value }),
    loop: this.loop(),
    virtualFocus: this.virtualFocus(),
    modal: this.modal(),
    presentation: this.presentation(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    autoComplete: this.autoComplete(),
    controller: this.controller(),
    dismissible: this.dismissible(),
    onDismissAttempt: (value) => this.dismissAttempt.emit(value),
  }))
  constructor() {
    useFormInputs(this.handle)
    usePopupRoot(
      SelectScope,
      { handle: this.handle, container: this.container },
      () => this.controller()
    )
  }
}

/**
 * A visible label for the select. Pressing it focuses the trigger, like a native select's label.
 * @experimental
 */
@Directive({ selector: "[uiSelectLabel]", exportAs: "uiSelectLabel" })
class SelectLabel {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(SelectScope).handle, "label").state
}

/**
 * The button that opens the list: a combobox named by the label. Typing on it selects the item that matches.
 * @experimental
 */
@Directive({
  selector: "[uiSelectTrigger]",
  exportAs: "uiSelectTrigger",
  providers: [SelectTriggerScope],
})
class SelectTrigger {
  /** Stops the trigger from opening the list. A native button can't be focused or pressed. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Connects a trigger outside the select to the select with this controller. */
  readonly controller: InputSignal<SelectTriggerProps["controller"]> = input()

  readonly #field = useFieldControl()
  readonly #labelled =
    inject(new HostAttributeToken("aria-labelledby"), { optional: true }) !==
    null
  readonly #part = usePopupTrigger(
    SelectScope,
    "trigger",
    () => ({
      disabled: this.disabled(),
      named: !!this.#field || this.#labelled,
    }),
    {
      controller: () => this.controller(),
      plain: plainButton(this.disabled),
      inside: SelectTriggerScope,
      joined: this.#field?.joined,
    }
  )
  /** The trigger's state, as a signal. */
  readonly state = computed<SelectTriggerState>(
    () =>
      this.#part.state() ?? {
        open: false,
        disabled: !!this.disabled(),
        readOnly: false,
        required: false,
        placeholder: true,
      }
  )

  constructor() {
    useOwedFormInputs(inject(SelectScope, { optional: true })?.handle)
  }
}

/**
 * The selected item's label, or the placeholder. Left empty, it shows it for you.
 * @experimental
 */
@Directive({ selector: "[uiSelectValue]", exportAs: "uiSelectValue" })
class SelectValue {
  /** What shows while nothing is selected. Overrides the select's `placeholder`. */
  readonly placeholder: InputSignal<SelectValueProps["placeholder"]> = input()
  /** With `multiple`, how many labels show before the rest are counted, as in "Apple, Banana and 2 more", joined the way the page's language joins lists, or in English with the default `getMoreLabel`. */
  readonly maxLabels = input(undefined, { transform: optionalNumber })
  /** The words for the labels past `maxLabels`. */
  readonly getMoreLabel: InputSignal<SelectValueProps["getMoreLabel"]> = input()

  readonly #select = inject(SelectScope, { optional: true })
  readonly #trigger = inject(SelectTriggerScope, { optional: true })
  readonly #part = useTriggerPart(
    SelectScope,
    SelectTriggerScope,
    "value",
    () => ({
      placeholder: this.placeholder(),
      maxLabels: this.maxLabels(),
      getMoreLabel: this.getMoreLabel(),
    })
  )
  /** The value's state, as a signal. */
  readonly state = computed<SelectValueState>(
    () =>
      this.#part.state() ?? {
        value: null,
        label: "",
        labels: [],
        placeholder: true,
      }
  )

  constructor() {
    useText(() => {
      const state = this.state()
      if (!state.placeholder) {
        return state.label
      }
      const select = this.#trigger?.root() ?? this.#select
      return this.placeholder() ?? select?.handle.instance.get().placeholder
    })
  }
}

/**
 * The popup that holds the items, positioned against the trigger. `*uiSelectContent` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiSelectContent]",
  exportAs: "uiSelectContent",
  providers: [PopupScope],
})
class SelectContent {
  /** Which side of the trigger the list opens on. */
  readonly side: InputSignal<SelectContentProps["side"]> = input()
  /** How the list lines up with the trigger along that side. */
  readonly align: InputSignal<SelectContentProps["align"]> = input()
  /** Gap between the trigger and the list, in pixels. */
  readonly sideOffset = input(undefined, { transform: optionalNumber })
  /** Shift along the trigger, in pixels. */
  readonly alignOffset = input(undefined, { transform: optionalNumber })
  /** Space to keep from the viewport edges, in pixels. */
  readonly collisionPadding = input(undefined, { transform: optionalNumber })
  /** Space to keep between the arrow and the popup's corners, in pixels. */
  readonly arrowPadding = input(undefined, { transform: optionalNumber })
  /** Positions the popup against this instead of its trigger: an element, a CSS selector, a point like `{ x, y }`, or anything with `getBoundingClientRect()`. It's read on every check, so it can move. A controller's `open({ anchor })` wins for that open. */
  readonly anchor: InputSignal<SelectContentProps["anchor"]> = input()
  /** Whether the list overlaps the trigger so the selected item sits on it, like a native select on macOS. Falls back to opening below when there isn't room, and for touch. */
  readonly alignItemWithTrigger = input(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the list stays in the page, hidden, while closed. Its content keeps its state between opens. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiSelectContent="{ side: 'bottom' }"`. */
  readonly uiSelectContent: StarInput<SelectContentProps> = input(undefined, {
    transform: starInputs<SelectContentProps>,
  })

  /** The part's state, as a signal. */
  readonly state = usePopupContent(
    inject(SelectScope),
    "content",
    () =>
      withStar(this.uiSelectContent(), {
        side: this.side(),
        align: this.align(),
        sideOffset: this.sideOffset(),
        alignOffset: this.alignOffset(),
        collisionPadding: this.collisionPadding(),
        arrowPadding: this.arrowPadding(),
        anchor: this.anchor(),
        alignItemWithTrigger: this.alignItemWithTrigger(),
        keepMounted: this.keepMounted(),
      }),
    {
      container: () => this.container() ?? this.uiSelectContent()?.container,
      viewport: true,
    }
  ).state

  static ngTemplateContextGuard(
    _directive: SelectContent,
    context: unknown
  ): context is { $implicit: SelectContentState } {
    return true
  }
}

/**
 * The listbox, when the content holds more than items, like a `SelectInput`. Put `uiSelectItems` inside to render the select's `items` that match.
 * @experimental
 */
@Directive({ selector: "[uiSelectList]", exportAs: "uiSelectList" })
class SelectList {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(SelectScope).handle, "list").state
}

/**
 * A search field inside `SelectContent` that filters the list while focus stays in it. Put the items in a `SelectList`. Name it with `aria-label`.
 * @experimental
 */
@Directive({ selector: "[uiSelectInput]", exportAs: "uiSelectInput" })
class SelectInput {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(SelectScope).handle, "input").state
}

/**
 * An option. Pressing it selects it, or toggles it with `multiple`.
 * @experimental
 */
@Directive({ selector: "[uiSelectItem]", exportAs: "uiSelectItem" })
class SelectItem {
  readonly #group = inject(SelectGroup, { optional: true })

  /** The text the trigger shows and typing finds, when the content isn't plain text. Not the accessible name: use `aria-label` for that. */
  readonly label: InputSignal<SelectItemProps<any>["label"]> = input()
  /** Keeps the item from being chosen. The keyboard and the pointer skip it. Sets `data-disabled` and `aria-disabled`. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** The item's position among all items, for virtualized lists that render only some. Sets `aria-posinset` and `aria-setsize`. */
  readonly index = input(undefined, { transform: optionalNumber })
  /** What the value becomes when the item is chosen. A string, or any value with `itemToValue`. */
  readonly value = input.required<SelectItemProps<any>["value"]>()

  readonly #owner = inject(SelectScope).handle
  /** The string the item's value is identified by. */
  readonly key = computed(() => this.#owner.api.internal.keyOf(this.value()))
  /** The item's text, for the parts inside it: its `label`, or a string value. */
  readonly text = computed(() => {
    const value: unknown = this.value()
    return this.label() ?? (typeof value === "string" ? value : undefined)
  })
  /** The part's state, as a signal. */
  readonly state = usePart(this.#owner, "item", () => ({
    id: this.key(),
    label: this.label(),
    disabled: this.disabled(),
    index: this.index(),
    value: this.value(),
    group: this.#group?.id,
  })).state
}

/**
 * The item's text, with the part the search matched in `<mark>`. Left empty, it shows the item's label.
 * @experimental
 */
@Directive({ selector: "[uiSelectItemText]", exportAs: "uiSelectItemText" })
class SelectItemText {
  readonly #item = inject(SelectItem)
  readonly #marked = useMarkedText()
  /** The text's state, as a signal. */
  readonly state = usePart(inject(SelectScope).handle, "item-text", () => ({
    id: this.#item.key(),
    text: this.#marked.text() ?? this.#item.text() ?? "",
  })).state

  constructor() {
    this.#marked.show(() => this.state().segments)
  }
}

/**
 * The check inside a selected item. Rendered while it's selected, or always with `keepMounted`. `*uiSelectItemIndicator` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiSelectItemIndicator]",
  exportAs: "uiSelectItemIndicator",
})
class SelectItemIndicator {
  readonly #item = inject(SelectItem)

  /** Whether the indicator stays in the page while its item isn't selected, so it can be styled or animated in both states. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(
    inject(SelectScope).handle,
    "item-indicator",
    () => ({
      id: this.#item.key(),
      item: this.#item.key(),
      keepMounted: this.keepMounted(),
    })
  ).state

  static ngTemplateContextGuard(
    _directive: SelectItemIndicator,
    context: unknown
  ): context is { $implicit: SelectItemIndicatorState } {
    return true
  }
}

/**
 * A group of items, named by its `SelectGroupLabel`, and hidden while none of its items shows.
 * @experimental
 */
@Directive({ selector: "[uiSelectGroup]", exportAs: "uiSelectGroup" })
class SelectGroup {
  /** The id the parts inside it share. */
  readonly id = useId()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(SelectScope).handle, "group", () => ({
    id: this.id,
  })).state
}

/**
 * The group's heading, which names the group.
 * @experimental
 */
@Directive({ selector: "[uiSelectGroupLabel]", exportAs: "uiSelectGroupLabel" })
class SelectGroupLabel {
  readonly #group = inject(SelectGroup)

  /** The part's state, as a signal. */
  readonly state = usePart(inject(SelectScope).handle, "group-label", () => ({
    id: this.#group.id,
    group: this.#group.id,
  })).state
}

/**
 * A line between items or groups, hidden from screen readers.
 * @experimental
 */
@Directive({ selector: "[uiSelectSeparator]", exportAs: "uiSelectSeparator" })
class SelectSeparator {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(SelectScope).handle, "separator").state
}

/**
 * Shown while no item matches the search. Its message is announced when it appears.
 * @experimental
 */
@Directive({ selector: "[uiSelectEmpty]", exportAs: "uiSelectEmpty" })
class SelectEmpty {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(SelectScope).handle, "empty", () => ({
    stash: true,
  })).state

  constructor() {
    useEmptyMessage(() => this.state().empty)
  }
}

/**
 * A polite live region for loading and result counts. Its content is yours, from its `state()`.
 * @experimental
 */
@Directive({ selector: "[uiSelectStatus]", exportAs: "uiSelectStatus" })
class SelectStatus {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(SelectScope).handle, "status").state
}

/**
 * A button that selects nothing. Shown while something is selected, or always with `keepMounted`. `*uiSelectClear` renders it only while it's shown.
 * @experimental
 */
@Directive({ selector: "[uiSelectClear]", exportAs: "uiSelectClear" })
class SelectClear {
  /** Whether the clear button stays in the page while nothing is selected. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(SelectScope).handle, "clear", () => ({
    keepMounted: this.keepMounted(),
  })).state

  static ngTemplateContextGuard(
    _directive: SelectClear,
    context: unknown
  ): context is { $implicit: SelectClearState } {
    return true
  }
}

/**
 * An arrow on the popup's edge that points at the trigger.
 * @experimental
 */
@Directive({ selector: "[uiSelectArrow]", exportAs: "uiSelectArrow" })
class SelectArrow {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(SelectScope).handle, "arrow").state
}

/**
 * An icon inside an item. `uiSelectValueIcon` shows the selected item's in the trigger. Screen readers, typeahead and filtering skip it, and `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiSelectItemIcon]", exportAs: "uiSelectItemIcon" })
class SelectItemIcon {
  /** Flips the icon horizontally in right-to-left text, for icons that point a way, like arrows and chevrons. Icons that picture a thing, like a clock or a check, stay as they are. */
  readonly mirror = input(undefined, { transform: optionalBoolean })

  readonly #select = inject(SelectScope).handle
  readonly #item = inject(SelectItem, { optional: true })
  readonly #id = useId()
  /** The icon's state, as a signal. */
  readonly state = usePart(this.#select, "item-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
    item: this.#item?.key(),
  })).state

  constructor() {
    useFeature(this.#select, selectItemIcons)
  }
}

/**
 * The selected item's icon, copied from its `uiSelectItemIcon`, like before the value in the trigger. Shown while one item is selected and it has an icon. `*uiSelectValueIcon` renders it only then.
 * @experimental
 */
@Directive({ selector: "[uiSelectValueIcon]", exportAs: "uiSelectValueIcon" })
class SelectValueIcon {
  constructor() {
    useTriggerPart(
      SelectScope,
      SelectTriggerScope,
      "value-icon",
      undefined,
      selectItemIcons
    )
  }
}

/**
 * An option that selects every item that matches, with `multiple`: in its group inside a `uiSelectGroup`, or in the whole list. `*uiSelectSelectAll` renders it only while it's shown.
 * @experimental
 */
@Directive({ selector: "[uiSelectSelectAll]", exportAs: "uiSelectSelectAll" })
class SelectSelectAll {
  readonly #select = inject(SelectScope).handle
  readonly #group = inject(SelectGroup, { optional: true })
  /** The option's state, as a signal. */
  readonly state = usePart(this.#select, "select-all", () => ({
    id: selectAllKey(this.#group?.id),
  })).state

  constructor() {
    useFeature(this.#select, selectSelectAll)
  }

  static ngTemplateContextGuard(
    _directive: SelectSelectAll,
    context: unknown
  ): context is { $implicit: SelectSelectAllState } {
    return true
  }
}

/**
 * Renders data items as bare parts, inside your content: its own `items`, or
 * the select's that match. Its element only holds them and takes no space.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiSelectItems]",
  exportAs: "uiSelectItems",
  host: { style: "display: contents" },
  imports: [SelectGroup, SelectGroupLabel, SelectItem, SelectSeparator],
  template: `
    @for (entry of entries(); track key(entry, $index)) {
      @switch (entry.type) {
        @case ("separator") {
          <div uiSelectSeparator></div>
        }
        @case ("group") {
          <div uiSelectGroup>
            @if (entry.label) {
              <div uiSelectGroupLabel>{{ entry.label }}</div>
            }
            <div uiSelectItems [items]="entry.items"></div>
          </div>
        }
        @case ("item") {
          <div
            uiSelectItem
            [value]="entry.value"
            [label]="entry.label"
            [disabled]="entry.disabled"
          >
            {{ entry.label }}
          </div>
        }
      }
    }
  `,
})
class SelectItems {
  /** The entries to render. Without it, the select's `items` that match. */
  readonly items = input<ListData<any>>()

  readonly #select = inject(SelectScope).handle
  readonly #store = useStore(this.#select)
  protected readonly entries = computed(() => {
    const items = this.items()
    if (!items) {
      this.#store()
    }
    const shown: ListData<any> =
      items ?? this.#select.api.internal.listbox.visibleData()?.list ?? []
    return shown.map(listEntry)
  })

  protected key(entry: ReturnType<typeof listEntry>, index: number) {
    return entry.type === "item"
      ? this.#select.api.internal.keyOf(entry.value)
      : `${entry.type}-${index}`
  }
}

export { createSelectController } from "@ui-sdk/core/select"
// Core's `SelectValue` type ends in `Data` here, since the component has its name.
export type {
  ListAnnouncement,
  ListData,
  ListFilter,
  ListGroup,
  ListHighlightDetails,
  ListItem,
  ListSeparator,
  MatchSegment,
  SelectApi,
  SelectArrowState,
  SelectChangeOptions,
  SelectClearProps,
  SelectClearState,
  SelectContentProps,
  SelectContentState,
  SelectController,
  SelectDismissReason,
  SelectEmptyState,
  SelectInputState,
  SelectItemIconProps,
  SelectItemIconState,
  SelectItemIndicatorProps,
  SelectItemIndicatorState,
  SelectItemProps,
  SelectItemState,
  SelectItemTextState,
  SelectOpenChangeReason,
  SelectOptions,
  SelectPrimitive,
  SelectQueryChangeReason,
  SelectSelectAllState,
  SelectStatusState,
  SelectTriggerProps,
  SelectTriggerState,
  SelectValue as SelectValueData,
  SelectValueChangeReason,
  SelectValueProps,
  SelectValueState,
} from "@ui-sdk/core/select"

export {
  Select,
  SelectArrow,
  SelectClear,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  type SelectHighlight,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectList,
  type SelectOpenChange,
  type SelectQueryChange,
  SelectSeparator,
  SelectStatus,
  SelectTrigger,
  SelectValue,
  type SelectValueChange,
  SelectItemIcon,
  SelectValueIcon,
  SelectSelectAll,
  SelectItems,
}
