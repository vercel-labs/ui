import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  Injectable,
  inject,
  input,
  output,
  TemplateRef,
  ViewContainerRef,
  type InputSignal,
} from "@angular/core"
import {
  command,
  type CommandActionDetails,
  type CommandData,
  type CommandDataItem,
  type CommandItemProps,
  type CommandItemState,
  type CommandOptions,
  type CommandShortcutProps,
} from "@ui-sdk/core/command"
import {
  optionalBoolean,
  optionalNumber,
  type StarInput,
  starInputs,
  withStar,
} from "./inputs.ts"
import {
  emitChange,
  EventActionEmitter,
  ValueActionEmitter,
  type Waiting,
} from "./outputs.ts"
import { PopupRoot, usePopupRoot } from "./popup.ts"
import { useId, usePart, usePrimitive, useStore } from "./use-primitive.ts"
import { present as isPresent } from "@ui-sdk/core/renderer"
import { listEntry, useEmptyMessage, useMarkedText } from "./list-context.ts"
import { useText } from "./text.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type CommandValueChange = Parameters<
  NonNullable<CommandOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<CommandOptions["onValueChange"]>>[0]
}

/**
 * What `(beforeQueryChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type CommandQueryChange = Parameters<
  NonNullable<CommandOptions["onQueryChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<CommandOptions["onQueryChange"]>>[0]
}

/**
 * What `(beforePagesChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type CommandPagesChange = Parameters<
  NonNullable<CommandOptions["onPagesChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<CommandOptions["onPagesChange"]>>[0]
}

/**
 * What `(action)` emits: the command's value, the event that ran it, and `waitUntil()`.
 * @experimental
 */
type CommandAction = CommandActionDetails &
  Waiting & {
    /** The `value` of the command that ran. */
    value: string
  }

/**
 * What a command's `(select)` emits: the event that ran it and `waitUntil()`.
 * @experimental
 */
type CommandItemSelect = Waiting & {
  /** The click or key press that ran the command, or a new `select` Event for a shortcut or a controller's `run()`. */
  event: Event
}

@Injectable()
class CommandScope extends PopupRoot<typeof command> {}

/**
 * A search field over an always-open list of commands. Renders a `div` around them.
 * @experimental
 */
@Directive({
  selector: "[uiCommand]",
  exportAs: "uiCommand",
  providers: [CommandScope],
  outputs: ["action"],
})
class Command {
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The highlighted command's value. Bind it with `[(value)]` to control the highlight. `null` highlights nothing. */
  readonly value: InputSignal<CommandOptions["value"]> = input()
  /** The command highlighted at first, when uncontrolled. Without it, the first command is, with `autoHighlight`. */
  readonly defaultValue: InputSignal<CommandOptions["defaultValue"]> = input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<CommandValueChange["value"]>()
  /** Runs when the highlight moves: arrow keys, the pointer, typing, a page change or a controller. `$event.cancel()` stops it. */
  readonly beforeValueChange = output<CommandValueChange>()
  /** The search text, which filters the commands. Bind it with `[(query)]` to control it. */
  readonly query: InputSignal<CommandOptions["query"]> = input()
  /** The search text at first, when uncontrolled. */
  readonly defaultQuery: InputSignal<CommandOptions["defaultQuery"]> = input()
  /** The new value, after a change that wasn't canceled. */
  readonly queryChange = output<CommandQueryChange["value"]>()
  /** Runs when the search text wants to change: typing, opening a page, going back, or a controller. `$event.cancel()` stops it. */
  readonly beforeQueryChange = output<CommandQueryChange>()
  /** The stack of open pages, from the first page opened to the current one. Bind it with `[(pages)]` to control it. */
  readonly pages: InputSignal<CommandOptions["pages"]> = input()
  /** The pages open at first, when uncontrolled. */
  readonly defaultPages: InputSignal<CommandOptions["defaultPages"]> = input()
  /** The new value, after a change that wasn't canceled. */
  readonly pagesChange = output<CommandPagesChange["value"]>()
  /** Runs when a page opens or Backspace or Escape goes back. `$event.cancel()` stops it. */
  readonly beforePagesChange = output<CommandPagesChange>()
  /** Runs when a command runs, with its value: Enter, a click, or its shortcut. `$event.waitUntil(promise)` marks the command pending until it settles. */
  readonly action = new ValueActionEmitter<string, CommandActionDetails>()
  /** What screen readers hear once a command has been pending for a second. An empty string says nothing. */
  readonly pendingAnnouncement: InputSignal<
    CommandOptions["pendingAnnouncement"]
  > = input()
  /** The commands as data. A `uiCommandItems` inside renders them, ranked as the user types, with pages for commands that have `items`. */
  readonly items: InputSignal<CommandOptions["items"]> = input()
  /** Commands shown instead of `items` on the first page while the search is empty, like recent ones. Needs `items`. */
  readonly emptyItems: InputSignal<CommandOptions["emptyItems"]> = input()
  /** How typing narrows the list: `"fuzzy"`, `"contains"`, `"startsWith"`, a scoring function, or `false` to keep every command. */
  readonly filter: InputSignal<CommandOptions["filter"]> = input()
  /** Whether the first command is highlighted while nothing else is, and the best match as the user types. */
  readonly autoHighlight = input(undefined, { transform: optionalBoolean })
  /** Whether arrow keys wrap from the last command to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Whether results are loading or failed, for the empty and status parts. */
  readonly status: InputSignal<CommandOptions["status"]> = input()
  /** Runs when the highlight or scrolling reaches the last command, so the next page can load. */
  readonly loadMore = output<void>()
  /** What screen readers hear after typing pauses, when no `CommandStatus` is rendered. Return null for nothing. */
  readonly announcement: InputSignal<CommandOptions["announcement"]> = input()
  /** Reads and drives the list from anywhere. Create one with `createCommandController()`. */
  readonly controller: InputSignal<CommandOptions["controller"]> = input()

  readonly handle = usePrimitive(command, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    query: this.query(),
    defaultQuery: this.defaultQuery(),
    onQueryChange: emitChange(this.beforeQueryChange, this.queryChange),
    pages: this.pages(),
    defaultPages: this.defaultPages(),
    onPagesChange: emitChange(this.beforePagesChange, this.pagesChange),
    onAction: this.action.handler(),
    pendingAnnouncement: this.pendingAnnouncement(),
    items: this.items(),
    emptyItems: this.emptyItems(),
    filter: this.filter(),
    autoHighlight: this.autoHighlight(),
    loop: this.loop(),
    status: this.status(),
    onLoadMore: () => this.loadMore.emit(),
    announcement: this.announcement(),
    controller: this.controller(),
  }))
  /** The command's state, as a signal. */
  readonly state = usePart(this.handle, "root").state

  constructor() {
    usePopupRoot(CommandScope, { handle: this.handle }, () => this.controller())
  }
}

/**
 * The search field. It keeps focus while arrow keys move the highlight. Name it with `aria-label`.
 * @experimental
 */
@Directive({ selector: "[uiCommandInput]", exportAs: "uiCommandInput" })
class CommandInput {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(CommandScope).handle, "input").state
}

/**
 * The listbox. Put `uiCommandItems` inside to render the command's `items`, ranked as the user types.
 * @experimental
 */
@Directive({ selector: "[uiCommandList]", exportAs: "uiCommandList" })
class CommandList {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(CommandScope).handle, "list").state
}

/**
 * A command. Pressing it, or Enter while it's highlighted, runs it, with its `value` in the command's `(action)`. `*uiCommandItem` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiCommandItem]",
  exportAs: "uiCommandItem",
  outputs: ["select"],
})
class CommandItem {
  /** Emitted by `(action)` and `(valueChange)`, and identifies the command. Without it, one is generated. */
  readonly value: InputSignal<CommandItemProps["value"]> = input()
  /** The text the search matches, when the content isn't plain text. Not the accessible name: use `aria-label` for that. */
  readonly label: InputSignal<CommandItemProps["label"]> = input()
  /** More words the search matches. */
  readonly keywords: InputSignal<CommandItemProps["keywords"]> = input()
  /** Keeps the command from running. Arrow keys and the pointer skip it. Sets `data-disabled` and `aria-disabled`. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** A keyboard shortcut that runs the command while it's in the page, like `"mod+p"`. Sets `aria-keyshortcuts`, and a `uiCommandShortcut` inside shows it. */
  readonly shortcut: InputSignal<CommandItemProps["shortcut"]> = input()
  /** The page choosing this command opens, instead of running it. */
  readonly page: InputSignal<CommandItemProps["page"]> = input()
  /** The command's position among all visible ones, for virtualized lists that render only some. Sets `aria-posinset` and `aria-setsize`. */
  readonly index = input(undefined, { transform: optionalNumber })
  /** Runs when the command runs, before the command's `(action)`. `$event.event.preventDefault()` skips `(action)` and the page. `$event.waitUntil(promise)` marks the command pending until it settles. */
  readonly select = new EventActionEmitter()
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiCommandItem="{ value: 'copy' }"`. */
  readonly uiCommandItem: StarInput<CommandItemProps> = input(undefined, {
    transform: starInputs<CommandItemProps>,
  })

  readonly #group = inject(CommandGroup, { optional: true })
  readonly #page = inject(CommandPage, { optional: true })
  readonly #data = !!inject(CommandItems, { optional: true })
  readonly #id = useId()
  /** The string that identifies the command: its `value`, or the generated one. */
  readonly key = computed(
    () => this.uiCommandItem()?.value ?? this.value() ?? this.#id
  )
  /** The command's state, as a signal. */
  readonly state = usePart(inject(CommandScope).handle, "item", () => ({
    ...withStar(this.uiCommandItem(), {
      label: this.label(),
      keywords: this.keywords(),
      disabled: this.disabled(),
      shortcut: this.shortcut(),
      page: this.page(),
      index: this.index(),
    }),
    id: this.key(),
    value: this.key(),
    onSelect: this.select.handler(),
    group: this.#group?.id,
    inPage: this.#page ? (this.#page.value() ?? null) : undefined,
    data: this.#data,
  })).state

  static ngTemplateContextGuard(
    _directive: CommandItem,
    context: unknown
  ): context is { $implicit: CommandItemState } {
    return true
  }
}

/**
 * The command's text, with the part the search matched in `<mark>`. Left empty, it shows the command's label.
 * @experimental
 */
@Directive({ selector: "[uiCommandItemText]", exportAs: "uiCommandItemText" })
class CommandItemText {
  readonly #item = inject(CommandItem)
  readonly #marked = useMarkedText()
  /** The text's state, as a signal. */
  readonly state = usePart(inject(CommandScope).handle, "item-text", () => ({
    id: this.#item.key(),
    text: this.#marked.text() ?? this.#item.label() ?? this.#item.value() ?? "",
  })).state

  constructor() {
    this.#marked.show(() => this.state().segments)
  }
}

/**
 * An icon inside a command. Screen readers, typeahead and filtering skip it, and `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiCommandItemIcon]", exportAs: "uiCommandItemIcon" })
class CommandItemIcon {
  /** Flips the icon horizontally in right-to-left text, for icons that point a way, like arrows and chevrons. Icons that picture a thing, like a clock or a check, stay as they are. */
  readonly mirror = input(undefined, { transform: optionalBoolean })

  readonly #item = inject(CommandItem, { optional: true })
  readonly #id = useId()
  /** The icon's state, as a signal. */
  readonly state = usePart(inject(CommandScope).handle, "item-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
    item: this.#item?.key(),
  })).state
}

/**
 * A group of commands. It hides while none of its commands matches the search.
 * @experimental
 */
@Directive({ selector: "[uiCommandGroup]", exportAs: "uiCommandGroup" })
class CommandGroup {
  /** The id the parts inside it share. */
  readonly id = useId()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(CommandScope).handle, "group", () => ({
    id: this.id,
  })).state
}

/**
 * A group's heading, which names it.
 * @experimental
 */
@Directive({
  selector: "[uiCommandGroupLabel]",
  exportAs: "uiCommandGroupLabel",
})
class CommandGroupLabel {
  readonly #group = inject(CommandGroup)

  /** The part's state, as a signal. */
  readonly state = usePart(inject(CommandScope).handle, "group-label", () => ({
    id: this.#group.id,
    group: this.#group.id,
  })).state
}

/**
 * A line between groups. Composed separators hide while the list is filtered.
 * @experimental
 */
@Directive({ selector: "[uiCommandSeparator]", exportAs: "uiCommandSeparator" })
class CommandSeparator {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(CommandScope).handle, "separator").state
}

/**
 * Shown while no command matches. Its message is announced when it appears. Place it outside the list.
 * @experimental
 */
@Directive({ selector: "[uiCommandEmpty]", exportAs: "uiCommandEmpty" })
class CommandEmpty {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(CommandScope).handle, "empty", () => ({
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
@Directive({ selector: "[uiCommandStatus]", exportAs: "uiCommandStatus" })
class CommandStatus {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(CommandScope).handle, "status").state
}

/**
 * Commands shown while this page is on top: `*uiCommandPage="'settings'"` around them, or `*uiCommandPage` for the first page. Renders no element.
 * @experimental
 */
@Directive({ selector: "[uiCommandPage]" })
class CommandPage {
  /** The page's name, which a command's `page` opens. Leave it empty for the first page. */
  readonly uiCommandPage = input<string>()

  /** The page's name, or undefined for the first page. */
  readonly value = computed(() => this.uiCommandPage() || undefined)

  constructor() {
    const command = inject(CommandScope).handle
    const store = useStore(command)
    const template = inject(TemplateRef)
    const container = inject(ViewContainerRef)
    effect(() => {
      store()
      const shown = isPresent(
        command.instance.part("page", { value: this.value() })
      )
      if (shown && !container.length) {
        container.createEmbeddedView(template)
      } else if (!shown) {
        container.clear()
      }
    })
  }
}

/**
 * The keys of a command's shortcut, formatted for the platform. Inside a command, its `shortcut`. Left empty, it shows the keys.
 * @experimental
 */
@Directive({ selector: "[uiCommandShortcut]", exportAs: "uiCommandShortcut" })
class CommandShortcut {
  /** The keys to show, like `"mod+p"`. Inside a command, its `shortcut`. */
  readonly shortcut: InputSignal<CommandShortcutProps["shortcut"]> = input()

  readonly #item = inject(CommandItem, { optional: true })
  /** The shortcut's state, as a signal. */
  readonly state = usePart(inject(CommandScope).handle, "shortcut", () => ({
    shortcut: this.shortcut() ?? this.#item?.shortcut(),
  })).state

  constructor() {
    useText(() => this.state().text)
  }
}

/**
 * Renders data commands as bare parts, inside your list: its own `items`, or
 * the command's that match. Its element only holds them and takes no space.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiCommandItems]",
  exportAs: "uiCommandItems",
  host: { style: "display: contents" },
  imports: [CommandGroup, CommandGroupLabel, CommandItem, CommandSeparator],
  template: `
    @for (entry of entries(); track key(entry, $index)) {
      @switch (entry.type) {
        @case ("separator") {
          <div uiCommandSeparator></div>
        }
        @case ("group") {
          <div uiCommandGroup>
            @if (entry.label) {
              <div uiCommandGroupLabel>{{ entry.label }}</div>
            }
            <div uiCommandItems [items]="entry.items"></div>
          </div>
        }
        @case ("item") {
          <div
            uiCommandItem
            [value]="entry.value"
            [label]="entry.label"
            [keywords]="entry.keywords"
            [disabled]="entry.disabled"
            [shortcut]="entry.shortcut"
          >
            {{ entry.label }}
          </div>
        }
      }
    }
  `,
})
class CommandItems {
  /** The entries to render. Without it, the command's `items` that match, on the page that's on top. */
  readonly items = input<CommandData>()

  readonly #command = inject(CommandScope).handle
  readonly #store = useStore(this.#command)
  protected readonly entries = computed(() => {
    const items = this.items()
    if (!items) {
      this.#store()
    }
    const visible = this.#command.api.internal.listbox.visibleData()?.list
    return (items ?? (visible as CommandData | undefined) ?? []).map((entry) =>
      listEntry<string, CommandDataItem>(entry)
    )
  })

  protected key(
    entry: ReturnType<CommandItems["entries"]>[number],
    index: number
  ) {
    return entry.type === "item" ? entry.value : `${entry.type}-${index}`
  }
}

export { createCommandController } from "@ui-sdk/core/command"
export type {
  CommandActionDetails,
  CommandApi,
  CommandChangeOptions,
  CommandController,
  CommandData,
  CommandDataGroup,
  CommandDataItem,
  CommandEmptyState,
  CommandInputState,
  CommandItemIconProps,
  CommandItemIconState,
  CommandItemProps,
  CommandItemState,
  CommandItemTextState,
  CommandListState,
  CommandOptions,
  CommandPageProps,
  CommandPagesChangeReason,
  CommandPrimitive,
  CommandQueryChangeReason,
  CommandState,
  CommandShortcutProps,
  CommandShortcutState,
  CommandStatusState,
  CommandValueChangeDetails,
  CommandValueChangeReason,
  ListAnnouncement,
  ListFilter,
  ListSeparator,
  MatchSegment,
  SearchFilter,
} from "@ui-sdk/core/command"

export {
  Command,
  type CommandAction,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  type CommandItemSelect,
  CommandItemText,
  CommandList,
  CommandPage,
  type CommandPagesChange,
  type CommandQueryChange,
  CommandSeparator,
  CommandShortcut,
  CommandStatus,
  type CommandValueChange,
  CommandItems,
}
