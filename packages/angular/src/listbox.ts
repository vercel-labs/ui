import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  listbox,
  type ListData,
  type ListboxItemIndicatorState,
  type ListboxItemProps,
  type ListboxOptions,
} from "@ui-sdk/core/listbox"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { listEntry } from "./list-context.ts"
import { emitChange } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
import { useFormInputs } from "./native-input.ts"
import { useId, usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type ListboxValueChange<Value = any> = Parameters<
  NonNullable<ListboxOptions<any, boolean>["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Value
}

/**
 * What `(highlight)` emits: the value and what came with it.
 * @experimental
 */
type ListboxHighlight = Parameters<
  NonNullable<ListboxOptions<any, boolean>["onHighlight"]>
>[1] & {
  /** The value it reports. */
  value: Parameters<NonNullable<ListboxOptions<any, boolean>["onHighlight"]>>[0]
}

/**
 * An always-visible list to choose one option from, or several with `multiple`.
 * @experimental
 */
@Directive({ selector: "[uiListbox]", exportAs: "uiListbox" })
class Listbox<Value = any> {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The selected value. Bind it with `[(value)]` to control the listbox. `null` selects nothing, and with `multiple` it's a list. */
  readonly value = input<Value>()
  /** The value selected at first, when uncontrolled. A form reset returns to it. */
  readonly defaultValue = input<Value>()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<Value>()
  /** Runs when a user, a form reset or a controller wants to change the value. `$event.cancel()` stops it. */
  readonly beforeValueChange = output<ListboxValueChange<Value>>()
  /** Whether several items can be selected. */
  readonly multiple = input(undefined, { transform: optionalBoolean })
  /** Whether the selection follows focus. */
  readonly activation: InputSignal<ListboxOptions<any, boolean>["activation"]> =
    input()
  /** Whether pressing the selected item of a single listbox unselects it. */
  readonly deselectable = input(undefined, { transform: optionalBoolean })
  /** Which arrow keys move between items. */
  readonly orientation: InputSignal<
    ListboxOptions<any, boolean>["orientation"]
  > = input()
  /** Whether arrow keys wrap from the last item to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Keeps focus on the list, which points at the highlighted option with `aria-activedescendant`. */
  readonly virtualFocus = input(undefined, { transform: optionalBoolean })
  /** Whether the list scrolls the option keys move to into view, and the selected option when it first shows. */
  readonly keepInView = input(undefined, { transform: optionalBoolean })
  /** The items as data. A `uiListboxItems` inside renders them. */
  readonly items: InputSignal<ListboxOptions<any, boolean>["items"]> = input()
  /** The string an item's value submits as and is identified by, for object values. */
  readonly itemToValue: InputSignal<
    ListboxOptions<any, boolean>["itemToValue"]
  > = input()
  /** Whether an item's value is the selected value, for object values that aren't the same object. */
  readonly isItemEqualToValue: InputSignal<
    ListboxOptions<any, boolean>["isItemEqualToValue"]
  > = input()
  /** Runs when focus moves to another item. */
  readonly highlight = output<ListboxHighlight>()
  /** Disables the listbox like a native control. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps the listbox focusable and its value submitted, but stops changes. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Blocks form submission until a value is selected. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name the value submits under. */
  readonly name: InputSignal<ListboxOptions<any, boolean>["name"]> = input()
  /** The id of a form to belong to, when the listbox isn't inside that form. */
  readonly form: InputSignal<ListboxOptions<any, boolean>["form"]> = input()
  /** Reads and sets the listbox from anywhere. Create one with `createListboxController()`. */
  readonly controller: InputSignal<ListboxOptions<any, boolean>["controller"]> =
    input()

  readonly handle = usePrimitive(listbox, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    multiple: this.multiple(),
    activation: this.activation(),
    deselectable: this.deselectable(),
    orientation: this.orientation(),
    loop: this.loop(),
    virtualFocus: this.virtualFocus(),
    keepInView: this.keepInView(),
    items: this.items(),
    itemToValue: this.itemToValue(),
    isItemEqualToValue: this.isItemEqualToValue(),
    onHighlight: (value, details) => this.highlight.emit({ ...details, value }),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    controller: this.controller(),
  }))
  /** The listbox's state, as a signal. */
  readonly state = usePart(this.handle, "root", undefined, {
    joined: this.#field?.joined,
  }).state

  constructor() {
    useFormInputs(this.handle)
  }
}

/**
 * An option. Pressing it selects it, or toggles it with `multiple`.
 * @experimental
 */
@Directive({ selector: "[uiListboxItem]", exportAs: "uiListboxItem" })
class ListboxItem {
  readonly #group = inject(ListboxGroup, { optional: true })

  /** What the value becomes when the item is chosen. A string, or any value with `itemToValue`. */
  readonly value = input.required<ListboxItemProps<any>["value"]>()
  /** The text typing finds, when the content isn't plain text. Not the accessible name: use `aria-label` for that. */
  readonly label: InputSignal<ListboxItemProps<any>["label"]> = input()
  /** Keeps the item from being chosen. Arrow keys, typing and ranges skip it. Sets `data-disabled` and `aria-disabled`. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** The item's position among all items, for virtualized lists that render only some. Sets `aria-posinset` and `aria-setsize`. */
  readonly index = input(undefined, { transform: optionalNumber })

  readonly #owner = inject(Listbox).handle
  /** The string the item's value is identified by. */
  readonly key = computed(() => this.#owner.api.internal.keyOf(this.value()))
  /** The part's state, as a signal. */
  readonly state = usePart(this.#owner, "item", () => ({
    id: this.key(),
    value: this.value(),
    label: this.label(),
    disabled: this.disabled(),
    index: this.index(),
    group: this.#group?.id,
  })).state
}

/**
 * The check inside a selected item. Rendered while it's selected, or always with `keepMounted`. `*uiListboxItemIndicator` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiListboxItemIndicator]",
  exportAs: "uiListboxItemIndicator",
})
class ListboxItemIndicator {
  readonly #item = inject(ListboxItem)

  /** Whether the indicator stays in the page while its item isn't selected, so it can be styled or animated in both states. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Listbox).handle, "item-indicator", () => ({
    id: this.#item.key(),
    item: this.#item.key(),
    keepMounted: this.keepMounted(),
  })).state

  static ngTemplateContextGuard(
    _directive: ListboxItemIndicator,
    context: unknown
  ): context is { $implicit: ListboxItemIndicatorState } {
    return true
  }
}

/**
 * An icon inside an item. Screen readers and typeahead skip it, and `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiListboxItemIcon]", exportAs: "uiListboxItemIcon" })
class ListboxItemIcon {
  readonly #item = inject(ListboxItem, { optional: true })

  /** Flips the icon horizontally in right-to-left text, for icons that point a way, like arrows and chevrons. Icons that picture a thing, like a clock or a check, stay as they are. */
  readonly mirror = input(undefined, { transform: optionalBoolean })

  readonly #id = useId()
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Listbox).handle, "item-icon", () => ({
    mirror: this.mirror(),
    id: this.#id,
    item: this.#item?.key(),
  })).state
}

/**
 * A group of items, named by its `ListboxGroupLabel`.
 * @experimental
 */
@Directive({ selector: "[uiListboxGroup]", exportAs: "uiListboxGroup" })
class ListboxGroup {
  /** The id the parts inside it share. */
  readonly id = useId()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Listbox).handle, "group", () => ({
    id: this.id,
  })).state
}

/**
 * The group's heading, which names the group.
 * @experimental
 */
@Directive({
  selector: "[uiListboxGroupLabel]",
  exportAs: "uiListboxGroupLabel",
})
class ListboxGroupLabel {
  readonly #group = inject(ListboxGroup)

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Listbox).handle, "group-label", () => ({
    id: this.#group.id,
    group: this.#group.id,
  })).state
}

/**
 * A line between items or groups, hidden from screen readers.
 * @experimental
 */
@Directive({ selector: "[uiListboxSeparator]", exportAs: "uiListboxSeparator" })
class ListboxSeparator {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Listbox).handle, "separator").state
}

/**
 * Renders data items as bare parts, inside your content: its own `items`, or
 * the listbox's. Its element only holds them and takes no space.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiListboxItems]",
  exportAs: "uiListboxItems",
  host: { style: "display: contents" },
  imports: [ListboxGroup, ListboxGroupLabel, ListboxItem, ListboxSeparator],
  template: `
    @for (entry of entries(); track key(entry, $index)) {
      @switch (entry.type) {
        @case ("separator") {
          <div uiListboxSeparator></div>
        }
        @case ("group") {
          <div uiListboxGroup>
            @if (entry.label) {
              <div uiListboxGroupLabel>{{ entry.label }}</div>
            }
            <div uiListboxItems [items]="entry.items"></div>
          </div>
        }
        @case ("item") {
          <div
            uiListboxItem
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
class ListboxItems {
  /** The entries to render. Without it, the listbox's `items`. */
  readonly items = input<ListData<any>>()

  readonly #listbox = inject(Listbox)
  protected readonly entries = computed(() =>
    (this.items() ?? this.#listbox.state().items).map(listEntry)
  )

  protected key(entry: ReturnType<typeof listEntry>, index: number) {
    return entry.type === "item"
      ? this.#listbox.handle.api.internal.keyOf(entry.value)
      : `${entry.type}-${index}`
  }
}

export { createListboxController } from "@ui-sdk/core/listbox"
export type {
  ListData,
  ListGroup,
  ListHighlightDetails,
  ListItem,
  ListSeparator,
  ListboxApi,
  ListboxChangeOptions,
  ListboxController,
  ListboxItemIconProps,
  ListboxItemIconState,
  ListboxItemIndicatorProps,
  ListboxItemIndicatorState,
  ListboxItemProps,
  ListboxItemState,
  ListboxOptions,
  ListboxPrimitive,
  ListboxState,
  ListboxValue,
  ListboxValueChangeReason,
} from "@ui-sdk/core/listbox"

export {
  Listbox,
  ListboxGroup,
  ListboxGroupLabel,
  type ListboxHighlight,
  ListboxItem,
  ListboxItemIcon,
  ListboxItemIndicator,
  ListboxSeparator,
  type ListboxValueChange,
  ListboxItems,
}
