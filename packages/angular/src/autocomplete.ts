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
  autocomplete,
  type ListData,
  type AutocompleteContentProps,
  type AutocompleteClearState,
  type AutocompleteContentState,
  type AutocompleteItemProps,
  type AutocompleteOptions,
} from "@ui-sdk/core/autocomplete"
import {
  optionalBoolean,
  optionalNumber,
  type StarInput,
  starInputs,
  withStar,
} from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
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
  useStore,
  type PopupContainer,
} from "./use-primitive.ts"
import { listEntry, useEmptyMessage, useMarkedText } from "./list-context.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type AutocompleteValueChange = Parameters<
  NonNullable<AutocompleteOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<AutocompleteOptions["onValueChange"]>>[0]
}

/**
 * What `(beforeOpenChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type AutocompleteOpenChange = Parameters<
  NonNullable<AutocompleteOptions["onOpenChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<AutocompleteOptions["onOpenChange"]>>[0]
}

/**
 * What `(submit)` emits: the value and what came with it.
 * @experimental
 */
type AutocompleteSubmit = Parameters<
  NonNullable<AutocompleteOptions["onSubmit"]>
>[1] & {
  /** The value it reports. */
  value: Parameters<NonNullable<AutocompleteOptions["onSubmit"]>>[0]
}

/**
 * What `(highlight)` emits: the value and what came with it.
 * @experimental
 */
type AutocompleteHighlight = Parameters<
  NonNullable<AutocompleteOptions["onHighlight"]>
>[1] & {
  /** The value it reports. */
  value: Parameters<NonNullable<AutocompleteOptions["onHighlight"]>>[0]
}

@Injectable()
class AutocompleteScope extends PopupRoot<typeof autocomplete> {
  readonly header = signal<HTMLElement | null>(null)
}

/**
 * A text field that suggests as you type. The text is the value. Renders no element of its own.
 * @experimental
 */
@Directive({
  selector: "[uiAutocomplete]",
  exportAs: "uiAutocomplete",
  providers: [AutocompleteScope],
})
class Autocomplete {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The text. Bind it with `[(value)]` to control it. */
  readonly value: InputSignal<AutocompleteOptions["value"]> = input()
  /** The text at first, when uncontrolled. A form reset returns to it. */
  readonly defaultValue: InputSignal<AutocompleteOptions["defaultValue"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<AutocompleteValueChange["value"]>()
  /** Runs when the text wants to change: typing, choosing a suggestion, a Clear part, a form reset or a controller. `$event.cancel()` keeps it as it was. */
  readonly beforeValueChange = output<AutocompleteValueChange>()
  /** Whether the suggestions are open. Bind it with `[(open)]` to control them. */
  readonly open = input(undefined, { transform: optionalBoolean })
  /** Whether the suggestions start open, when uncontrolled. */
  readonly defaultOpen = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly openChange = output<AutocompleteOpenChange["value"]>()
  /** Runs when the suggestions want to open or close. `$event.cancel()` stops it. */
  readonly beforeOpenChange = output<AutocompleteOpenChange>()
  /** Runs once the suggestions have finished opening or closing, after any animation. */
  readonly openChangeComplete =
    output<
      Parameters<NonNullable<AutocompleteOptions["onOpenChangeComplete"]>>[0]
    >()
  /** Runs with the text when Enter is pressed with no suggestion highlighted, or after choosing one with `submitOnSelect`. The surrounding form submits next, unless the event's `preventDefault()` is called. */
  readonly submit = output<AutocompleteSubmit>()
  /** The suggestions as data. A `uiAutocompleteItems` inside renders them, and the autocomplete filters them without rendering every one. */
  readonly items: InputSignal<AutocompleteOptions["items"]> = input()
  /** Suggestions shown instead of `items` while the field is empty, like recent searches, with `openOnFocus`. Needs `items`. */
  readonly emptyItems: InputSignal<AutocompleteOptions["emptyItems"]> = input()
  /** How typing narrows the suggestions: `"contains"`, `"startsWith"`, `"fuzzy"`, a function of the item and the text, or `false` to keep every one, for results a server already filtered. */
  readonly filter: InputSignal<AutocompleteOptions["filter"]> = input()
  /** Whether typing completes the text with the first suggestion that starts with it, with the rest selected after the caret. */
  readonly inlineComplete = input(undefined, { transform: optionalBoolean })
  /** Whether the first suggestion is highlighted while typing, so Enter chooses it. */
  readonly autoHighlight = input(undefined, { transform: optionalBoolean })
  /** Whether the suggestions open when the field gets focus, even before anything is typed. */
  readonly openOnFocus = input(undefined, { transform: optionalBoolean })
  /** Whether choosing a suggestion submits, like a search box: `onSubmit` runs, then the form submits. */
  readonly submitOnSelect = input(undefined, { transform: optionalBoolean })
  /** Whether results are loading or failed, for the empty and status parts. */
  readonly status: InputSignal<AutocompleteOptions["status"]> = input()
  /** Runs when the highlight moves, with the suggestion's index among the visible ones. */
  readonly highlight = output<AutocompleteHighlight>()
  /** Runs when the highlight or scrolling reaches the last suggestion, so the next page can load. */
  readonly loadMore = output<void>()
  /** What screen readers hear after typing pauses, when no `AutocompleteStatus` is rendered. Return null for nothing. */
  readonly announcement: InputSignal<AutocompleteOptions["announcement"]> =
    input()
  /** Whether arrow keys wrap from the last suggestion to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** `false`: the page stays usable while the suggestions are open. `"pointer"`: an outside press only closes them. `true`: also locks scroll and makes the rest of the page inert. */
  readonly modal: InputSignal<AutocompleteOptions["modal"]> = input()
  /** How the suggestions present: a popover, a sheet with the field in its header, or `"auto"` for a sheet on small touch screens. */
  readonly presentation: InputSignal<AutocompleteOptions["presentation"]> =
    input()
  /** Disables the field like a native input. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps the field focusable and its text submitted, but stops changes. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Blocks form submission until there's text. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name the text submits under. */
  readonly name: InputSignal<AutocompleteOptions["name"]> = input()
  /** The id of a form to belong to, when the field isn't inside that form. */
  readonly form: InputSignal<AutocompleteOptions["form"]> = input()
  /** Opens, closes, reads and sets the autocomplete from anywhere. Create one with `createAutocompleteController()`. */
  readonly controller: InputSignal<AutocompleteOptions["controller"]> = input()
  /** Whether Escape, an outside press, focus or the window leaving, Android's back gesture, the screen reader's escape gesture and a swipe on a sheet can close the suggestions. Typing, the trigger, suggestions and the controller always can. */
  readonly dismissible = input(undefined, { transform: optionalBoolean })
  /** Runs when `dismissible` refused a dismissal made on purpose: Escape, an outside press, back, the screen reader's escape or a swipe. Focus or the window leaving is refused without it. */
  readonly dismissAttempt =
    output<
      Parameters<NonNullable<AutocompleteOptions["onDismissAttempt"]>>[0]
    >()
  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()

  readonly handle = usePrimitive(autocomplete, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    open: this.open(),
    defaultOpen: this.defaultOpen(),
    onOpenChange: emitChange(this.beforeOpenChange, this.openChange),
    onOpenChangeComplete: (value) => this.openChangeComplete.emit(value),
    onSubmit: (value, details) => this.submit.emit({ ...details, value }),
    items: this.items(),
    emptyItems: this.emptyItems(),
    filter: this.filter(),
    inlineComplete: this.inlineComplete(),
    autoHighlight: this.autoHighlight(),
    openOnFocus: this.openOnFocus(),
    submitOnSelect: this.submitOnSelect(),
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
    usePopupRoot(
      AutocompleteScope,
      { handle: this.handle, container: this.container },
      () => this.controller()
    )
  }
}

/**
 * A visible label for the field.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteLabel]",
  exportAs: "uiAutocompleteLabel",
})
class AutocompleteLabel {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(AutocompleteScope).handle, "label").state
}

/**
 * The text field. While the suggestions present as a sheet, it moves into the sheet's header.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteInput]",
  exportAs: "uiAutocompleteInput",
})
class AutocompleteInput {
  readonly #autocomplete = inject(AutocompleteScope)
  /** The input's state, as a signal. */
  readonly state = usePart(this.#autocomplete.handle, "input", undefined, {
    joined: useFieldControl()?.joined,
    portal: () => this.#autocomplete.header() ?? false,
  }).state
}

/**
 * A button that opens and closes the suggestions, out of the tab order.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteTrigger]",
  exportAs: "uiAutocompleteTrigger",
})
class AutocompleteTrigger {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(AutocompleteScope).handle, "trigger").state
}

/**
 * A button that empties the field. Shown while there's text to clear, or always with `keepMounted`. Name it with `aria-label`. `*uiAutocompleteClear` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteClear]",
  exportAs: "uiAutocompleteClear",
})
class AutocompleteClear {
  /** Whether the clear button stays in the page while the field is empty. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(AutocompleteScope).handle, "clear", () => ({
    keepMounted: this.keepMounted(),
  })).state

  static ngTemplateContextGuard(
    _directive: AutocompleteClear,
    context: unknown
  ): context is { $implicit: AutocompleteClearState } {
    return true
  }
}

/**
 * The popup that holds the suggestions, positioned against the field. `*uiAutocompleteContent` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteContent]",
  exportAs: "uiAutocompleteContent",
  providers: [PopupScope],
})
class AutocompleteContent {
  /** Which side of the field the suggestions open on. */
  readonly side: InputSignal<AutocompleteContentProps["side"]> = input()
  /** How the suggestions line up with the field along that side. */
  readonly align: InputSignal<AutocompleteContentProps["align"]> = input()
  /** Gap between the field and the suggestions, in pixels. */
  readonly sideOffset = input(undefined, { transform: optionalNumber })
  /** Shift along the field, in pixels. */
  readonly alignOffset = input(undefined, { transform: optionalNumber })
  /** Space to keep from the viewport edges, in pixels. */
  readonly collisionPadding = input(undefined, { transform: optionalNumber })
  /** Space to keep between the arrow and the popup's corners, in pixels. */
  readonly arrowPadding = input(undefined, { transform: optionalNumber })
  /** Positions the popup against this instead of the field: an element, a CSS selector, a point like `{ x, y }`, or anything with `getBoundingClientRect()`. It's read on every check, so it can move. A controller's `open({ anchor })` wins for that open. */
  readonly anchor: InputSignal<AutocompleteContentProps["anchor"]> = input()
  /** Whether the suggestions stay in the page, hidden, while closed. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })
  /** Renders the popup into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiAutocompleteContent="{ side: 'bottom' }"`. */
  readonly uiAutocompleteContent: StarInput<AutocompleteContentProps> = input(
    undefined,
    {
      transform: starInputs<AutocompleteContentProps>,
    }
  )

  readonly #autocomplete = inject(AutocompleteScope)
  /** The part's state, as a signal. */
  readonly state = usePopupContent(
    this.#autocomplete,
    "content",
    () =>
      withStar(this.uiAutocompleteContent(), {
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
        this.container() ?? this.uiAutocompleteContent()?.container,
      viewport: true,
      header: (el) => this.#autocomplete.header.set(el),
    }
  ).state

  static ngTemplateContextGuard(
    _directive: AutocompleteContent,
    context: unknown
  ): context is { $implicit: AutocompleteContentState } {
    return true
  }
}

/**
 * The listbox. Put `uiAutocompleteItems` inside to render the autocomplete's `items`, filtered.
 * @experimental
 */
@Directive({ selector: "[uiAutocompleteList]", exportAs: "uiAutocompleteList" })
class AutocompleteList {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(AutocompleteScope).handle, "list").state
}

/**
 * A suggestion. Choosing it fills the field in with its text.
 * @experimental
 */
@Directive({ selector: "[uiAutocompleteItem]", exportAs: "uiAutocompleteItem" })
class AutocompleteItem {
  readonly #group = inject(AutocompleteGroup, { optional: true })
  /** Identifies the suggestion. Choosing it fills the field with its `label`, or with this when there's none. */
  readonly value = input.required<AutocompleteItemProps["value"]>()
  /** The text the field gets and filtering matches, when the content isn't plain text. Not the accessible name: use `aria-label` for that. */
  readonly label: InputSignal<AutocompleteItemProps["label"]> = input()
  /** More words filtering matches. */
  readonly keywords: InputSignal<AutocompleteItemProps["keywords"]> = input()
  /** Keeps the suggestion from being chosen. Sets `data-disabled` and `aria-disabled`. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** The suggestion's position among all visible ones, for virtualized lists that render only some. Sets `aria-posinset` and `aria-setsize`. */
  readonly index = input(undefined, { transform: optionalNumber })

  /** The suggestion's state, as a signal. */
  readonly state = usePart(inject(AutocompleteScope).handle, "item", () => ({
    id: this.value(),
    value: this.value(),
    label: this.label(),
    keywords: this.keywords(),
    disabled: this.disabled(),
    index: this.index(),
    group: this.#group?.id,
  })).state
}

/**
 * The suggestion's text, with the part the field's text matched in `<mark>`. Left empty, it shows the suggestion's label.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteItemText]",
  exportAs: "uiAutocompleteItemText",
})
class AutocompleteItemText {
  readonly #item = inject(AutocompleteItem)
  readonly #marked = useMarkedText()
  /** The text's state, as a signal. */
  readonly state = usePart(
    inject(AutocompleteScope).handle,
    "item-text",
    () => ({
      id: this.#item.value(),
      text: this.#marked.text() ?? this.#item.label() ?? this.#item.value(),
    })
  ).state

  constructor() {
    this.#marked.show(() => this.state().segments)
  }
}

/**
 * An icon inside a suggestion. Screen readers, typeahead and filtering skip it, and `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteItemIcon]",
  exportAs: "uiAutocompleteItemIcon",
})
class AutocompleteItemIcon {
  /** Flips the icon horizontally in right-to-left text, for icons that point a way, like arrows and chevrons. Icons that picture a thing, like a clock or a check, stay as they are. */
  readonly mirror = input(undefined, { transform: optionalBoolean })

  readonly #item = inject(AutocompleteItem, { optional: true })
  readonly #id = useId()
  /** The icon's state, as a signal. */
  readonly state = usePart(
    inject(AutocompleteScope).handle,
    "item-icon",
    () => ({
      id: this.#id,
      mirror: this.mirror(),
      item: this.#item?.value(),
    })
  ).state
}

/**
 * A group of items, named by its `AutocompleteGroupLabel`, and hidden while none of its items shows.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteGroup]",
  exportAs: "uiAutocompleteGroup",
})
class AutocompleteGroup {
  /** The id the parts inside it share. */
  readonly id = useId()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(AutocompleteScope).handle, "group", () => ({
    id: this.id,
  })).state
}

/**
 * The group's heading, which names the group.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteGroupLabel]",
  exportAs: "uiAutocompleteGroupLabel",
})
class AutocompleteGroupLabel {
  readonly #group = inject(AutocompleteGroup)

  /** The part's state, as a signal. */
  readonly state = usePart(
    inject(AutocompleteScope).handle,
    "group-label",
    () => ({
      id: this.#group.id,
      group: this.#group.id,
    })
  ).state
}

/**
 * A line between items or groups, hidden from screen readers.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteSeparator]",
  exportAs: "uiAutocompleteSeparator",
})
class AutocompleteSeparator {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(AutocompleteScope).handle, "separator").state
}

/**
 * Shown while no suggestion matches. Its message is announced when it appears.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteEmpty]",
  exportAs: "uiAutocompleteEmpty",
})
class AutocompleteEmpty {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(AutocompleteScope).handle, "empty", () => ({
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
@Directive({
  selector: "[uiAutocompleteStatus]",
  exportAs: "uiAutocompleteStatus",
})
class AutocompleteStatus {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(AutocompleteScope).handle, "status").state
}

/**
 * An arrow on the popup's edge that points at the field.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteArrow]",
  exportAs: "uiAutocompleteArrow",
})
class AutocompleteArrow {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(AutocompleteScope).handle, "arrow").state
}

/**
 * Renders data items as bare parts, inside your list: its own `items`, or
 * the autocomplete's that match the text. Its element only holds them and takes no space.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiAutocompleteItems]",
  exportAs: "uiAutocompleteItems",
  host: { style: "display: contents" },
  imports: [
    AutocompleteGroup,
    AutocompleteGroupLabel,
    AutocompleteItem,
    AutocompleteSeparator,
  ],
  template: `
    @for (entry of entries(); track key(entry, $index)) {
      @switch (entry.type) {
        @case ("separator") {
          <div uiAutocompleteSeparator></div>
        }
        @case ("group") {
          <div uiAutocompleteGroup>
            @if (entry.label) {
              <div uiAutocompleteGroupLabel>{{ entry.label }}</div>
            }
            <div uiAutocompleteItems [items]="entry.items"></div>
          </div>
        }
        @case ("item") {
          <div
            uiAutocompleteItem
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
class AutocompleteItems {
  /** The entries to render. Without it, the autocomplete's `items` that match. */
  readonly items = input<ListData<string>>()

  readonly #autocomplete = inject(AutocompleteScope).handle
  readonly #store = useStore(this.#autocomplete)
  protected readonly entries = computed(() => {
    const items = this.items()
    if (!items) {
      this.#store()
    }
    const visible = this.#autocomplete.api.internal.listbox.visibleData()?.list
    return (items ?? (visible as ListData<string> | undefined) ?? []).map(
      listEntry
    )
  })

  protected key(entry: ReturnType<typeof listEntry>, index: number) {
    return entry.type === "item" ? entry.value : `${entry.type}-${index}`
  }
}

export { createAutocompleteController } from "@ui-sdk/core/autocomplete"
export type {
  AutocompleteApi,
  AutocompleteArrowState,
  AutocompleteChangeOptions,
  AutocompleteClearProps,
  AutocompleteClearState,
  AutocompleteContentProps,
  AutocompleteContentState,
  AutocompleteController,
  AutocompleteDismissReason,
  AutocompleteEmptyState,
  AutocompleteInputState,
  AutocompleteItemIconProps,
  AutocompleteItemIconState,
  AutocompleteItemProps,
  AutocompleteItemState,
  AutocompleteItemTextState,
  AutocompleteOpenChangeReason,
  AutocompleteOptions,
  AutocompletePrimitive,
  AutocompleteStatusState,
  AutocompleteSubmitDetails,
  AutocompleteTriggerState,
  AutocompleteValueChangeDetails,
  AutocompleteValueChangeReason,
  ListAnnouncement,
  ListData,
  ListFilter,
  ListGroup,
  ListHighlightDetails,
  ListItem,
  ListSeparator,
  MatchSegment,
  SearchFilter,
} from "@ui-sdk/core/autocomplete"

export {
  Autocomplete,
  AutocompleteArrow,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  type AutocompleteHighlight,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteItemIcon,
  AutocompleteItemText,
  AutocompleteLabel,
  AutocompleteList,
  type AutocompleteOpenChange,
  AutocompleteSeparator,
  AutocompleteStatus,
  type AutocompleteSubmit,
  AutocompleteTrigger,
  type AutocompleteValueChange,
  AutocompleteItems,
}
