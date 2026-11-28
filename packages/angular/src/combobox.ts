import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  Injectable,
  inject,
  input,
  output,
  signal,
  type InputSignal,
} from "@angular/core"
import {
  combobox,
  type ListData,
  type ComboboxChipProps,
  type ComboboxContentProps,
  type ComboboxCreateState,
  type ComboboxSelectAllState,
  type ComboboxValueState,
  type ComboboxClearState,
  type ComboboxContentState,
  type ComboboxItemIndicatorState,
  type ComboboxItemProps,
  type ComboboxOptions,
  type ComboboxValueProps,
} from "@ui-sdk/core/combobox"
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
  PopupRoot,
  PopupScope,
  usePopupContent,
  usePopupRoot,
} from "./popup.ts"
import {
  useFeature,
  useId,
  usePart,
  usePrimitive,
  useStore,
  type PopupContainer,
} from "./use-primitive.ts"
import {
  comboboxChips,
  comboboxCreate,
  comboboxItemIcons,
  comboboxSelectAll,
  selectAllKey,
} from "@ui-sdk/core/renderer"
import { listEntry, useEmptyMessage, useMarkedText } from "./list-context.ts"
import { emitWaiting, ListenedEmitter, type Waiting } from "./outputs.ts"
import { useText } from "./text.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type ComboboxValueChange<Value = any> = Parameters<
  NonNullable<ComboboxOptions<any, boolean>["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Value
}

/**
 * What `(beforeQueryChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type ComboboxQueryChange = Parameters<
  NonNullable<ComboboxOptions<any, boolean>["onQueryChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<
    NonNullable<ComboboxOptions<any, boolean>["onQueryChange"]>
  >[0]
}

/**
 * What `(beforeOpenChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type ComboboxOpenChange = Parameters<
  NonNullable<ComboboxOptions<any, boolean>["onOpenChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<
    NonNullable<ComboboxOptions<any, boolean>["onOpenChange"]>
  >[0]
}

/**
 * What `(highlight)` emits: the value and what came with it.
 * @experimental
 */
type ComboboxHighlight = Parameters<
  NonNullable<ComboboxOptions<any, boolean>["onHighlight"]>
>[1] & {
  /** The value it reports. */
  value: Parameters<
    NonNullable<ComboboxOptions<any, boolean>["onHighlight"]>
  >[0]
}

@Injectable()
class ComboboxScope extends PopupRoot<typeof combobox> {
  readonly header = signal<HTMLElement | null>(null)
}

/**
 * A text input that filters a list as you type. The combobox renders no element of its own: the input, the chips and the list are its parts.
 * @experimental
 */
@Directive({
  selector: "[uiCombobox]",
  exportAs: "uiCombobox",
  providers: [ComboboxScope],
})
class Combobox<Value = any> {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The selected values. Bind it with `[(value)]` to control the combobox. */
  readonly value = input<Value>()
  /** The values selected at first, when uncontrolled. A form reset returns to them. */
  readonly defaultValue = input<Value>()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<Value>()
  /** Runs when a user, a form reset or a controller wants to change the value. `$event.cancel()` stops it. */
  readonly beforeValueChange = output<ComboboxValueChange<Value>>()
  /** The input's text, which filters the list. Bind it with `[(query)]` to control it. Choosing an item sets it to the item's label, or empties it with `multiple`. */
  readonly query: InputSignal<ComboboxOptions<any, boolean>["query"]> = input()
  /** The input's text at first, when uncontrolled. Defaults to the selected item's label. */
  readonly defaultQuery: InputSignal<
    ComboboxOptions<any, boolean>["defaultQuery"]
  > = input()
  /** The new value, after a change that wasn't canceled. */
  readonly queryChange = output<ComboboxQueryChange["value"]>()
  /** Runs when the input's text wants to change: typing, choosing an item, or closing with text that wasn't chosen. `$event.cancel()` stops it. */
  readonly beforeQueryChange = output<ComboboxQueryChange>()
  /** Whether the list is open. Bind it with `[(open)]` to control it. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** Whether the list starts open, when uncontrolled. */
  readonly defaultOpen = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly openChange = output<ComboboxOpenChange["value"]>()
  /** Runs when the list wants to open or close. `$event.cancel()` stops it. */
  readonly beforeOpenChange = output<ComboboxOpenChange>()
  /** Runs once the list has finished opening or closing, after any animation. */
  readonly openChangeComplete =
    output<
      Parameters<
        NonNullable<ComboboxOptions<any, boolean>["onOpenChangeComplete"]>
      >[0]
    >()
  /** Whether several items can be selected. The value is then a list, the list stays open as items toggle, and the input empties after each choice. */
  readonly multiple = input(undefined, { transform: optionalBoolean })
  /** With `multiple`, how many items can be selected. Once reached, the other items are disabled. */
  readonly maxSelected = input(undefined, { transform: optionalNumber })
  /** What screen readers hear once the Create part's action has been pending for a second. An empty string says nothing. */
  readonly pendingAnnouncement: InputSignal<
    ComboboxOptions<any, boolean>["pendingAnnouncement"]
  > = input()
  /** The items as data. A `uiComboboxItems` inside renders them, and the combobox filters them without rendering every item. */
  readonly items: InputSignal<ComboboxOptions<any, boolean>["items"]> = input()
  /** Items shown instead of `items` while the input is empty, like recent choices. Needs `items`. */
  readonly emptyItems: InputSignal<
    ComboboxOptions<any, boolean>["emptyItems"]
  > = input()
  /** How typing narrows the list: `"contains"`, `"startsWith"`, a function of the item and the text, whose numeric result also sorts data items, or `false` to keep every item, for results a server already filtered. */
  readonly filter: InputSignal<ComboboxOptions<any, boolean>["filter"]> =
    input()
  /** The string an item's value submits as and is identified by, for object values. */
  readonly itemToValue: InputSignal<
    ComboboxOptions<any, boolean>["itemToValue"]
  > = input()
  /** The text a value shows, for values whose item isn't rendered, like async results. */
  readonly itemToLabel: InputSignal<
    ComboboxOptions<any, boolean>["itemToLabel"]
  > = input()
  /** Whether an item's value is the selected value, for object values that aren't the same object. */
  readonly isItemEqualToValue: InputSignal<
    ComboboxOptions<any, boolean>["isItemEqualToValue"]
  > = input()
  /** Whether the first matching item is highlighted while typing, so Enter chooses it. `"always"` also highlights the selected item, or the first, when the list opens. */
  readonly autoHighlight: InputSignal<
    ComboboxOptions<any, boolean>["autoHighlight"]
  > = input()
  /** With `multiple`, whether the input keeps its text after an item is chosen. */
  readonly keepQuery = input(undefined, { transform: optionalBoolean })
  /** Whether text that matches no item becomes the value, when Enter is pressed with nothing highlighted, or, without `multiple`, when the list closes. */
  readonly allowCustomValue = input(undefined, { transform: optionalBoolean })
  /** Whether results are loading or failed, for the status and empty parts. */
  readonly status: InputSignal<ComboboxOptions<any, boolean>["status"]> =
    input()
  /** Runs when the highlight moves, with the item's index among the visible items. */
  readonly highlight = output<ComboboxHighlight>()
  /** Runs when the highlight or scrolling reaches the last item, so the next page can load. */
  readonly loadMore = output<void>()
  /** What screen readers hear after typing pauses, when no `ComboboxStatus` is rendered, and when a chip is removed. Return null for nothing. */
  readonly announcement: InputSignal<
    ComboboxOptions<any, boolean>["announcement"]
  > = input()
  /** Whether arrow keys wrap from the last item to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** `false`: the page stays usable while the list is open. `"pointer"`: an outside press only closes the list. `true`: also locks scroll and makes the rest of the page inert. */
  readonly modal: InputSignal<ComboboxOptions<any, boolean>["modal"]> = input()
  /** How the list presents: a popover, a sheet with the input in its header, or `"auto"` for a sheet on small touch screens. */
  readonly presentation: InputSignal<
    ComboboxOptions<any, boolean>["presentation"]
  > = input()
  /** Disables the combobox like a native input. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps the combobox focusable and its value submitted, but stops changes. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Blocks form submission until a value is selected. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name the value submits under. Without one, the combobox submits nothing. */
  readonly name: InputSignal<ComboboxOptions<any, boolean>["name"]> = input()
  /** The id of a form to belong to, when the combobox isn't inside that form. */
  readonly form: InputSignal<ComboboxOptions<any, boolean>["form"]> = input()
  /** Opens, closes, reads and sets the combobox from anywhere. Create one with `createComboboxController()`. */
  readonly controller: InputSignal<
    ComboboxOptions<any, boolean>["controller"]
  > = input()
  /** Whether Escape, an outside press, focus or the window leaving, Android's back gesture, the screen reader's escape gesture and a swipe on a sheet can close the list. Typing, the trigger, items and the controller always can. */
  readonly dismissible = input(undefined, { transform: optionalBoolean })
  /** Runs when `dismissible` refused a dismissal made on purpose: Escape, an outside press, back, the screen reader's escape or a swipe. Focus or the window leaving is refused without it. */
  readonly dismissAttempt =
    output<
      Parameters<
        NonNullable<ComboboxOptions<any, boolean>["onDismissAttempt"]>
      >[0]
    >()
  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()

  readonly handle = usePrimitive(combobox, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    query: this.query(),
    defaultQuery: this.defaultQuery(),
    onQueryChange: emitChange(this.beforeQueryChange, this.queryChange),
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    onOpenChange: emitChange(this.beforeOpenChange, this.openChange),
    onOpenChangeComplete: (value) => this.openChangeComplete.emit(value),
    multiple: this.multiple(),
    maxSelected: this.maxSelected(),
    pendingAnnouncement: this.pendingAnnouncement(),
    items: this.items(),
    emptyItems: this.emptyItems(),
    filter: this.filter(),
    itemToValue: this.itemToValue(),
    itemToLabel: this.itemToLabel(),
    isItemEqualToValue: this.isItemEqualToValue(),
    autoHighlight: this.autoHighlight(),
    keepQuery: this.keepQuery(),
    allowCustomValue: this.allowCustomValue(),
    status: this.status(),
    onHighlight: (value, details) => this.highlight.emit({ ...details, value }),
    onLoadMore: () => this.loadMore.emit(),
    announcement: this.announcement(),
    loop: this.loop(),
    modal: this.modal(),
    presentation: this.presentation(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    controller: this.controller(),
    dismissible: this.dismissible(),
    onDismissAttempt: (value) => this.dismissAttempt.emit(value),
  }))
  constructor() {
    useFormInputs(this.handle)
    usePopupRoot(
      ComboboxScope,
      { handle: this.handle, container: this.container },
      () => this.controller()
    )
  }
}

/**
 * A visible label for the input.
 * @experimental
 */
@Directive({ selector: "[uiComboboxLabel]", exportAs: "uiComboboxLabel" })
class ComboboxLabel {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ComboboxScope).handle, "label").state
}

/**
 * The text input that filters the list and holds the chosen item's label. While the list presents as a sheet, it moves into the sheet's header.
 * @experimental
 */
@Directive({ selector: "[uiComboboxInput]", exportAs: "uiComboboxInput" })
class ComboboxInput {
  readonly #combobox = inject(ComboboxScope)
  /** The input's state, as a signal. */
  readonly state = usePart(this.#combobox.handle, "input", undefined, {
    joined: useFieldControl()?.joined,
    portal: () => this.#combobox.header() ?? false,
  }).state

  constructor() {
    useOwedFormInputs(this.#combobox.handle)
  }
}

/**
 * A button that opens and closes the list, out of the tab order.
 * @experimental
 */
@Directive({ selector: "[uiComboboxTrigger]", exportAs: "uiComboboxTrigger" })
class ComboboxTrigger {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ComboboxScope).handle, "trigger").state
}

/**
 * The popup that holds the list, positioned against the input. `*uiComboboxContent` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiComboboxContent]",
  exportAs: "uiComboboxContent",
  providers: [PopupScope],
})
class ComboboxContent {
  /** Which side of the input the list opens on. */
  readonly side: InputSignal<ComboboxContentProps["side"]> = input()
  /** How the list lines up with the input along that side. */
  readonly align: InputSignal<ComboboxContentProps["align"]> = input()
  /** Gap between the input and the list, in pixels. */
  readonly sideOffset = input(undefined, { transform: optionalNumber })
  /** Shift along the input, in pixels. */
  readonly alignOffset = input(undefined, { transform: optionalNumber })
  /** Space to keep from the viewport edges, in pixels. */
  readonly collisionPadding = input(undefined, { transform: optionalNumber })
  /** Space to keep between the arrow and the popup's corners, in pixels. */
  readonly arrowPadding = input(undefined, { transform: optionalNumber })
  /** Positions the popup against this instead of the input: an element, a CSS selector, a point like `{ x, y }`, or anything with `getBoundingClientRect()`. It's read on every check, so it can move. A controller's `open({ anchor })` wins for that open. */
  readonly anchor: InputSignal<ComboboxContentProps["anchor"]> = input()
  /** Whether the list stays in the page, hidden, while closed. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })
  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiComboboxContent="{ side: 'bottom' }"`. */
  readonly uiComboboxContent: StarInput<ComboboxContentProps> = input(
    undefined,
    {
      transform: starInputs<ComboboxContentProps>,
    }
  )

  readonly #combobox = inject(ComboboxScope)
  /** The part's state, as a signal. */
  readonly state = usePopupContent(
    this.#combobox,
    "content",
    () =>
      withStar(this.uiComboboxContent(), {
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
      container: () => this.container() ?? this.uiComboboxContent()?.container,
      viewport: true,
      header: (el) => this.#combobox.header.set(el),
    }
  ).state

  static ngTemplateContextGuard(
    _directive: ComboboxContent,
    context: unknown
  ): context is { $implicit: ComboboxContentState } {
    return true
  }
}

/**
 * The listbox. Put `uiComboboxItems` inside to render the combobox's `items`, filtered.
 * @experimental
 */
@Directive({ selector: "[uiComboboxList]", exportAs: "uiComboboxList" })
class ComboboxList {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ComboboxScope).handle, "list").state
}

/**
 * An option. Pressing it selects it, or toggles it with `multiple`.
 * @experimental
 */
@Directive({ selector: "[uiComboboxItem]", exportAs: "uiComboboxItem" })
class ComboboxItem {
  readonly #group = inject(ComboboxGroup, { optional: true })

  /** The text the input shows once chosen, and filtering matches, when the content isn't plain text. Not the accessible name: use `aria-label` for that. */
  readonly label: InputSignal<ComboboxItemProps<any>["label"]> = input()
  /** More words filtering matches. */
  readonly keywords: InputSignal<ComboboxItemProps<any>["keywords"]> = input()
  /** Keeps the item from being chosen. The keyboard and the pointer skip it. Sets `data-disabled` and `aria-disabled`. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** The item's position among all visible items, for virtualized lists that render only some. Sets `aria-posinset` and `aria-setsize`. */
  readonly index = input(undefined, { transform: optionalNumber })
  /** What the value becomes when the item is chosen. A string, or any value with `itemToValue`. */
  readonly value = input.required<ComboboxItemProps<any>["value"]>()

  readonly #owner = inject(ComboboxScope).handle
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
    keywords: this.keywords(),
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
@Directive({ selector: "[uiComboboxItemText]", exportAs: "uiComboboxItemText" })
class ComboboxItemText {
  readonly #item = inject(ComboboxItem)
  readonly #marked = useMarkedText()
  /** The text's state, as a signal. */
  readonly state = usePart(inject(ComboboxScope).handle, "item-text", () => ({
    id: this.#item.key(),
    text: this.#marked.text() ?? this.#item.text() ?? "",
  })).state

  constructor() {
    this.#marked.show(() => this.state().segments)
  }
}

/**
 * The check inside a selected item. Rendered while it's selected, or always with `keepMounted`. `*uiComboboxItemIndicator` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiComboboxItemIndicator]",
  exportAs: "uiComboboxItemIndicator",
})
class ComboboxItemIndicator {
  readonly #item = inject(ComboboxItem)

  /** Whether the indicator stays in the page while its item isn't selected. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(
    inject(ComboboxScope).handle,
    "item-indicator",
    () => ({
      id: this.#item.key(),
      item: this.#item.key(),
      keepMounted: this.keepMounted(),
    })
  ).state

  static ngTemplateContextGuard(
    _directive: ComboboxItemIndicator,
    context: unknown
  ): context is { $implicit: ComboboxItemIndicatorState } {
    return true
  }
}

/**
 * A group of items, named by its `ComboboxGroupLabel`, and hidden while none of its items shows.
 * @experimental
 */
@Directive({ selector: "[uiComboboxGroup]", exportAs: "uiComboboxGroup" })
class ComboboxGroup {
  /** The id the parts inside it share. */
  readonly id = useId()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(ComboboxScope).handle, "group", () => ({
    id: this.id,
  })).state
}

/**
 * The group's heading, which names the group.
 * @experimental
 */
@Directive({
  selector: "[uiComboboxGroupLabel]",
  exportAs: "uiComboboxGroupLabel",
})
class ComboboxGroupLabel {
  readonly #group = inject(ComboboxGroup)

  /** The part's state, as a signal. */
  readonly state = usePart(inject(ComboboxScope).handle, "group-label", () => ({
    id: this.#group.id,
    group: this.#group.id,
  })).state
}

/**
 * A line between items or groups, hidden from screen readers.
 * @experimental
 */
@Directive({
  selector: "[uiComboboxSeparator]",
  exportAs: "uiComboboxSeparator",
})
class ComboboxSeparator {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ComboboxScope).handle, "separator").state
}

/**
 * Shown while no item matches. Its message is announced when it appears.
 * @experimental
 */
@Directive({ selector: "[uiComboboxEmpty]", exportAs: "uiComboboxEmpty" })
class ComboboxEmpty {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ComboboxScope).handle, "empty", () => ({
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
@Directive({ selector: "[uiComboboxStatus]", exportAs: "uiComboboxStatus" })
class ComboboxStatus {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ComboboxScope).handle, "status").state
}

/**
 * A button that empties the input and selects nothing. Shown while there's something to clear, or always with `keepMounted`. `*uiComboboxClear` renders it only while it's shown.
 * @experimental
 */
@Directive({ selector: "[uiComboboxClear]", exportAs: "uiComboboxClear" })
class ComboboxClear {
  /** Whether the clear button stays in the page while there's nothing to clear. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(ComboboxScope).handle, "clear", () => ({
    keepMounted: this.keepMounted(),
  })).state

  static ngTemplateContextGuard(
    _directive: ComboboxClear,
    context: unknown
  ): context is { $implicit: ComboboxClearState } {
    return true
  }
}

/**
 * The selected value, for a summary or your own chips. On an element left empty, it shows the label. `*uiComboboxValue="let value"` renders your template with its state.
 * @experimental
 */
@Directive({ selector: "[uiComboboxValue]", exportAs: "uiComboboxValue" })
class ComboboxValue {
  /** With `multiple`, how many labels the `label` in its state shows before the rest are counted, as in "France, Chile and 2 more", joined the way the page's language joins lists, or in English with the default `getMoreLabel`. */
  readonly maxLabels = input(undefined, { transform: optionalNumber })
  /** The words for the labels past `maxLabels`. */
  readonly getMoreLabel: InputSignal<ComboboxValueProps["getMoreLabel"]> =
    input()
  /** The inputs as one object, for the `*` form: `*uiComboboxValue="{ maxLabels: 2 }; let value"`. */
  readonly uiComboboxValue: StarInput<ComboboxValueProps> = input(undefined, {
    transform: starInputs<ComboboxValueProps>,
  })

  /** The value's state, as a signal. */
  readonly state = usePart(inject(ComboboxScope).handle, "value", () =>
    withStar(this.uiComboboxValue(), {
      maxLabels: this.maxLabels(),
      getMoreLabel: this.getMoreLabel(),
    })
  ).state

  constructor() {
    useText(() => this.state().label)
  }

  static ngTemplateContextGuard(
    _directive: ComboboxValue,
    context: unknown
  ): context is { $implicit: ComboboxValueState } {
    return true
  }
}

/**
 * An arrow on the popup's edge that points at the input.
 * @experimental
 */
@Directive({ selector: "[uiComboboxArrow]", exportAs: "uiComboboxArrow" })
class ComboboxArrow {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(ComboboxScope).handle, "arrow").state
}

/**
 * The selected values as chips, around the input.
 * @experimental
 */
@Directive({ selector: "[uiComboboxChips]", exportAs: "uiComboboxChips" })
class ComboboxChips {
  readonly #combobox = inject(ComboboxScope).handle

  constructor() {
    useFeature(this.#combobox, comboboxChips)
    usePart(this.#combobox, "chips")
  }
}

/**
 * One selected value. Left empty, it shows the value's label.
 * @experimental
 */
@Directive({ selector: "[uiComboboxChip]", exportAs: "uiComboboxChip" })
class ComboboxChip {
  /** The selected value this chip shows. */
  readonly value = input.required<ComboboxChipProps<any>["value"]>()

  readonly #combobox = inject(ComboboxScope).handle
  /** The string the chip's value is identified by. */
  readonly key = computed(() => this.#combobox.api.internal.keyOf(this.value()))
  /** The chip's state, as a signal. */
  readonly state = usePart(this.#combobox, "chip", () => ({
    id: this.key(),
    value: this.value(),
  })).state

  constructor() {
    useFeature(this.#combobox, comboboxChips)
    useText(() => this.state().label)
  }
}

/**
 * A button inside a chip that removes its value. Name it with `aria-label`.
 * @experimental
 */
@Directive({
  selector: "[uiComboboxChipRemove]",
  exportAs: "uiComboboxChipRemove",
})
class ComboboxChipRemove {
  readonly #combobox = inject(ComboboxScope).handle
  readonly #chip = inject(ComboboxChip)
  /** The button's state, as a signal. */
  readonly state = usePart(this.#combobox, "chip-remove", () => ({
    id: this.#chip.key(),
    value: this.#chip.value(),
  })).state

  constructor() {
    useFeature(this.#combobox, comboboxChips)
  }
}

/**
 * How many chips don't fit on the chips' line, once some collapse. Putting it inside `uiComboboxChips` turns collapsing on. Left empty, it shows "+2 more".
 * @experimental
 */
@Directive({
  selector: "[uiComboboxChipsOverflow]",
  exportAs: "uiComboboxChipsOverflow",
})
class ComboboxChipsOverflow {
  readonly #combobox = inject(ComboboxScope).handle
  /** The part's state, as a signal. */
  readonly state = usePart(this.#combobox, "chips-overflow").state

  constructor() {
    useFeature(this.#combobox, comboboxChips)
    useText(() => `+${this.state().count} more`)
  }
}

/**
 * What `(create)` emits: the input's text, and `waitUntil()` to keep the option pending.
 * @experimental
 */
type ComboboxCreateRequest = Waiting & {
  /** The input's text. */
  query: string
}

/**
 * An option that creates an item from the input's text. Shown while the text matches no item's label exactly, and hidden otherwise. Left empty, it shows `Create “text”`. To render it only while it's shown, put it on a template: `<ng-template uiComboboxCreate (create)="add($event)">`.
 * @experimental
 */
@Directive({
  selector: "[uiComboboxCreate]",
  exportAs: "uiComboboxCreate",
  outputs: ["create"],
})
class ComboboxCreate {
  /** Runs with the input's text when the create option is chosen. It doesn't change the value by itself. `$event.waitUntil(promise)` marks the option pending until it settles; the list closes (or the input empties, with `multiple`) once it resolves. */
  readonly create = new ListenedEmitter<ComboboxCreateRequest>()
  /** How many characters the text needs before the option shows. */
  readonly minLength = input(undefined, { transform: optionalNumber })
  readonly #combobox = inject(ComboboxScope).handle
  readonly #run = (query: string) => emitWaiting(this.create, { query })
  /** The option's state, as a signal. */
  readonly state = usePart(this.#combobox, "create", () => ({
    onCreate: this.create.listened() ? this.#run : undefined,
    minLength: this.minLength(),
  })).state

  constructor() {
    useFeature(this.#combobox, comboboxCreate)
    useText(() => `Create “${this.state().query}”`)
  }

  static ngTemplateContextGuard(
    _directive: ComboboxCreate,
    context: unknown
  ): context is { $implicit: ComboboxCreateState } {
    return true
  }
}

/**
 * An icon inside an item. `uiComboboxValueIcon` shows the selected item's next to the input. Screen readers, typeahead and filtering skip it, and `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiComboboxItemIcon]", exportAs: "uiComboboxItemIcon" })
class ComboboxItemIcon {
  /** Flips the icon horizontally in right-to-left text, for icons that point a way, like arrows and chevrons. Icons that picture a thing, like a clock or a check, stay as they are. */
  readonly mirror = input(undefined, { transform: optionalBoolean })

  readonly #combobox = inject(ComboboxScope).handle
  readonly #item = inject(ComboboxItem, { optional: true })
  readonly #id = useId()
  /** The icon's state, as a signal. */
  readonly state = usePart(this.#combobox, "item-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
    item: this.#item?.key(),
  })).state

  constructor() {
    useFeature(this.#combobox, comboboxItemIcons)
  }
}

/**
 * The selected item's icon, copied from its `uiComboboxItemIcon`, like next to the input. Shown while one item is selected and it has an icon. `*uiComboboxValueIcon` renders it only then.
 * @experimental
 */
@Directive({
  selector: "[uiComboboxValueIcon]",
  exportAs: "uiComboboxValueIcon",
})
class ComboboxValueIcon {
  readonly #combobox = inject(ComboboxScope).handle

  constructor() {
    useFeature(this.#combobox, comboboxItemIcons)
    usePart(this.#combobox, "value-icon")
  }
}

/**
 * An option that selects every item that matches, with `multiple`: in its group inside a `uiComboboxGroup`, or in the whole list. `*uiComboboxSelectAll` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiComboboxSelectAll]",
  exportAs: "uiComboboxSelectAll",
})
class ComboboxSelectAll {
  readonly #combobox = inject(ComboboxScope).handle
  readonly #group = inject(ComboboxGroup, { optional: true })
  /** The option's state, as a signal. */
  readonly state = usePart(this.#combobox, "select-all", () => ({
    id: selectAllKey(this.#group?.id),
  })).state

  constructor() {
    useFeature(this.#combobox, comboboxSelectAll)
  }

  static ngTemplateContextGuard(
    _directive: ComboboxSelectAll,
    context: unknown
  ): context is { $implicit: ComboboxSelectAllState } {
    return true
  }
}

/**
 * Renders data items as bare parts, inside your list: its own `items`, or
 * the combobox's that match. Its element only holds them and takes no space.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiComboboxItems]",
  exportAs: "uiComboboxItems",
  host: { style: "display: contents" },
  imports: [ComboboxGroup, ComboboxGroupLabel, ComboboxItem, ComboboxSeparator],
  template: `
    @for (entry of entries(); track key(entry, $index)) {
      @switch (entry.type) {
        @case ("separator") {
          <div uiComboboxSeparator></div>
        }
        @case ("group") {
          <div uiComboboxGroup>
            @if (entry.label) {
              <div uiComboboxGroupLabel>{{ entry.label }}</div>
            }
            <div uiComboboxItems [items]="entry.items"></div>
          </div>
        }
        @case ("item") {
          <div
            uiComboboxItem
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
class ComboboxItems {
  /** The entries to render. Without it, the combobox's `items` that match. */
  readonly items = input<ListData<any>>()

  readonly #combobox = inject(ComboboxScope).handle
  readonly #store = useStore(this.#combobox)
  protected readonly entries = computed(() => {
    const items = this.items()
    if (!items) {
      this.#store()
    }
    const shown: ListData<any> =
      items ?? this.#combobox.api.internal.listbox.visibleData()?.list ?? []
    return shown.map(listEntry)
  })

  protected key(entry: ReturnType<typeof listEntry>, index: number) {
    return entry.type === "item"
      ? this.#combobox.api.internal.keyOf(entry.value)
      : `${entry.type}-${index}`
  }
}

export { createComboboxController } from "@ui-sdk/core/combobox"
// Core's `ComboboxValue` type ends in `Data` here, since the component has its name.
export type {
  ComboboxApi,
  ComboboxArrowState,
  ComboboxChangeOptions,
  ComboboxChipProps,
  ComboboxChipState,
  ComboboxChipsOverflowState,
  ComboboxClearProps,
  ComboboxClearState,
  ComboboxContentProps,
  ComboboxContentState,
  ComboboxController,
  ComboboxCreateProps,
  ComboboxCreateState,
  ComboboxDismissReason,
  ComboboxEmptyState,
  ComboboxInputState,
  ComboboxItemIconProps,
  ComboboxItemIconState,
  ComboboxItemIndicatorProps,
  ComboboxItemIndicatorState,
  ComboboxItemProps,
  ComboboxItemState,
  ComboboxItemTextState,
  ComboboxOpenChangeReason,
  ComboboxOptions,
  ComboboxPrimitive,
  ComboboxQueryChangeReason,
  ComboboxSelectAllState,
  ComboboxStatusState,
  ComboboxTriggerState,
  ComboboxValue as ComboboxValueData,
  ComboboxValueChangeReason,
  ComboboxValueProps,
  ComboboxValueState,
  ListAnnouncement,
  ListData,
  ListFilter,
  ListGroup,
  ListHighlightDetails,
  ListItem,
  ListSeparator,
  MatchSegment,
} from "@ui-sdk/core/combobox"

export {
  Combobox,
  ComboboxArrow,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  type ComboboxHighlight,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  type ComboboxOpenChange,
  type ComboboxQueryChange,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
  type ComboboxValueChange,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChipsOverflow,
  type ComboboxCreateRequest,
  ComboboxCreate,
  ComboboxItemIcon,
  ComboboxValueIcon,
  ComboboxSelectAll,
  ComboboxItems,
}
