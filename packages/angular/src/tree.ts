import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  Injectable,
  inject,
  input,
  output,
  signal,
  type InputSignal,
} from "@angular/core"
import {
  tree,
  type TreeActionDetails,
  type TreeItemData,
  type TreeMode,
  type TreeValue,
  type TreeGroupProps,
  type TreeGroupState,
  type TreeItemProps,
  type TreeOptions,
} from "@ui-sdk/core/tree"
import {
  optionalBoolean,
  type StarInput,
  starInputs,
  withStar,
} from "./inputs.ts"
import { emitChange, ValueActionEmitter, type Waiting } from "./outputs.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type TreeValueChange<Value = any> = Parameters<
  NonNullable<TreeOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Value
}

/**
 * What `(beforeExpandedChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type TreeExpandedChange = Parameters<
  NonNullable<TreeOptions["onExpandedChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<TreeOptions["onExpandedChange"]>>[0]
}

/**
 * What `(beforeCheckedChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type TreeCheckedChange = Parameters<
  NonNullable<TreeOptions["onCheckedChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<TreeOptions["onCheckedChange"]>>[0]
}

/**
 * What `(action)` emits: the item's value, the event that ran it, and `waitUntil()`.
 * @experimental
 */
type TreeAction = TreeActionDetails &
  Waiting & {
    /** The `value` of the item that ran. */
    value: string
  }

// What an item hands the parts inside it, and the items in its group.
@Injectable()
class TreeItemScope {
  value: () => string = () => ""
  /** How many groups joined the item. One makes it a branch. */
  readonly groups = signal(0)
  /** The props of its label, indicator and checkbox, which hear when it becomes a branch. */
  readonly props = () => {
    this.groups()
    return { value: this.value() }
  }
}

/**
 * What `(highlight)` emits: the value and what came with it.
 * @experimental
 */
type TreeHighlight = Parameters<NonNullable<TreeOptions["onHighlight"]>>[1] & {
  /** The value it reports. */
  value: Parameters<NonNullable<TreeOptions["onHighlight"]>>[0]
}

/**
 * A tree of items that expand and collapse, with one tab stop and arrow keys between its items.
 * @experimental
 */
@Directive({
  selector: "[uiTree]",
  exportAs: "uiTree",
  outputs: ["action"],
  // Top-level items have no parent, even in a tree inside another's item.
  providers: [{ provide: TreeItemScope, useValue: null }],
})
class Tree<Value extends TreeValue<TreeMode> = any> {
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The items as data: each a `value`, a `label` and, for a branch, `children`. A `uiTreeItems` inside renders them, and they give the tree its whole shape even where rows aren't rendered. */
  readonly items: InputSignal<TreeOptions["items"]> = input()
  /** Items from file paths, like `["src/index.ts", "README.md"]`: each folder becomes a branch, folders first. A path ending in `/` is an empty folder. */
  readonly paths: InputSignal<TreeOptions["paths"]> = input()
  /** How many items can be selected: `"none"`, `"single"` or `"multiple"`. */
  readonly mode: InputSignal<TreeOptions["mode"]> = input()
  /** The selected value. Bind it with `[(value)]` to control the selection. `null` selects nothing, and with `mode: "multiple"` it's a list. */
  readonly value = input<Value>()
  /** The value selected at first, when uncontrolled. */
  readonly defaultValue = input<Value>()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<Value>()
  /** Runs when the selection wants to change. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeValueChange = output<TreeValueChange<Value>>()
  /** Whether moving focus with the keyboard selects, with one item selectable. `"manual"` waits for Enter, Space or a press. */
  readonly activation: InputSignal<TreeOptions["activation"]> = input()
  /** The expanded branches' values. Bind it with `[(expanded)]` to control which branches are open. */
  readonly expanded: InputSignal<TreeOptions["expanded"]> = input()
  /** The branches expanded at first, when uncontrolled. The ancestors of `current` are added. */
  readonly defaultExpanded: InputSignal<TreeOptions["defaultExpanded"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly expandedChange = output<TreeExpandedChange["value"]>()
  /** Runs when branches want to expand or collapse. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeExpandedChange = output<TreeExpandedChange>()
  /** Whether pressing a branch's row expands or collapses it. Its indicator always does. */
  readonly expandOnPress = input(undefined, { transform: optionalBoolean })
  /** Gives every item a tri-state checkbox, kept apart from the selection. */
  readonly checkable = input(undefined, { transform: optionalBoolean })
  /** The checked items' values, as `checkStrategy` reports them. Bind it with `[(checked)]` to control the checkboxes. */
  readonly checked: InputSignal<TreeOptions["checked"]> = input()
  /** The items checked at first, when uncontrolled. A branch stands for everything in it. */
  readonly defaultChecked: InputSignal<TreeOptions["defaultChecked"]> = input()
  /** The new value, after a change that wasn't canceled. */
  readonly checkedChange = output<TreeCheckedChange["value"]>()
  /** Runs when checkboxes want to change. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeCheckedChange = output<TreeCheckedChange>()
  /** Which items the checked value lists: `"leaf"`, `"trunk"`, `"branch"` or `"independent"`. */
  readonly checkStrategy: InputSignal<TreeOptions["checkStrategy"]> = input()
  /** Runs when an item is pressed or Enter is pressed on it, apart from selecting it. `$event.waitUntil(promise)` marks the item pending until it settles. */
  readonly action = new ValueActionEmitter<string, TreeActionDetails>()
  /** What screen readers hear once an item's action has been pending for a second. An empty string says nothing. */
  readonly pendingAnnouncement: InputSignal<
    TreeOptions["pendingAnnouncement"]
  > = input()
  /** Loads a branch's children the first time it expands while it has none. */
  readonly loadChildren: InputSignal<TreeOptions["loadChildren"]> = input()
  /** The value of the item for the current page. It gets `aria-current="page"`, takes the tab stop first, and its ancestors expand. */
  readonly current: InputSignal<TreeOptions["current"]> = input()
  /** Runs when the keyboard moves focus to an item, with its row among the items that show, from 0. */
  readonly highlight = output<TreeHighlight>()
  /** Disables every item. Items stay focusable unless `focusableWhenDisabled` is false. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Whether disabled items take focus, so a screen reader still finds them. */
  readonly focusableWhenDisabled = input(undefined, {
    transform: optionalBoolean,
  })
  /** Whether collapsed branches keep their groups in the page, hidden. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })
  /** Keeps collapsed groups in the page as `hidden="until-found"`, so find in page can match their text and expand them. */
  readonly hiddenUntilFound = input(undefined, { transform: optionalBoolean })
  /** What screen readers hear when a branch expands, collapses, starts loading or fails to load. Return null for nothing. */
  readonly announcement: InputSignal<TreeOptions["announcement"]> = input()
  /** Drives the tree from anywhere. Create one with `createTreeController()`. */
  readonly controller: InputSignal<TreeOptions["controller"]> = input()

  readonly handle = usePrimitive(tree, () => ({
    debug: this.debug(),
    items: this.items(),
    paths: this.paths(),
    mode: this.mode(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange<TreeValueChange>(
      this.beforeValueChange,
      this.valueChange
    ),
    activation: this.activation(),
    expanded: this.expanded(),
    defaultExpanded: this.defaultExpanded(),
    onExpandedChange: emitChange(
      this.beforeExpandedChange,
      this.expandedChange
    ),
    expandOnPress: this.expandOnPress(),
    checkable: this.checkable(),
    checked: this.checked(),
    defaultChecked: this.defaultChecked(),
    onCheckedChange: emitChange(this.beforeCheckedChange, this.checkedChange),
    checkStrategy: this.checkStrategy(),
    onAction: this.action.handler(),
    pendingAnnouncement: this.pendingAnnouncement(),
    loadChildren: this.loadChildren(),
    current: this.current(),
    onHighlight: (value, details) => this.highlight.emit({ ...details, value }),
    disabled: this.disabled(),
    focusableWhenDisabled: this.focusableWhenDisabled(),
    keepMounted: this.keepMounted(),
    hiddenUntilFound: this.hiddenUntilFound(),
    announcement: this.announcement(),
    controller: this.controller(),
  }))
  /** The tree's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * An item. Put its text in a `uiTreeItemLabel` and its children in a `uiTreeGroup`, which makes it a branch. Set `branch` for one whose children load later.
 * @experimental
 */
@Directive({
  selector: "[uiTreeItem]",
  exportAs: "uiTreeItem",
  providers: [TreeItemScope],
})
class TreeItem {
  /** Identifies the item, unique in the tree. Emitted by `(action)`, and listed by the value, `expanded` and `checked`. */
  readonly value = input.required<TreeItemProps["value"]>()
  /** Whether it's a branch. A `uiTreeGroup` inside makes it one; set it yourself for a branch whose children load later. */
  readonly branch = input(undefined, { transform: optionalBoolean })
  /** Stops it from being selected, checked, expanded or run. It stays focusable unless `focusableWhenDisabled` is false. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** The item's text, for typeahead and announcements, when its label isn't rendered yet or isn't plain text. */
  readonly label: InputSignal<TreeItemProps["label"]> = input()

  readonly #parent = inject(TreeItemScope, { optional: true, skipSelf: true })
  readonly #scope = inject(TreeItemScope, { self: true })
  /** The item's state, as a signal. */
  readonly state = usePart(inject(Tree).handle, "item", () => ({
    value: this.value(),
    parent: this.#parent?.value() ?? null,
    branch: this.branch() ?? (this.#scope.groups() > 0 || undefined),
    disabled: this.disabled(),
    label: this.label(),
  })).state

  constructor() {
    this.#scope.value = this.value
  }
}

/**
 * The item's text, which names it. Put it on a link to make the item one.
 * @experimental
 */
@Directive({ selector: "[uiTreeItemLabel]", exportAs: "uiTreeItemLabel" })
class TreeItemLabel {
  /** The item's state, as a signal. */
  readonly state = usePart(
    inject(Tree).handle,
    "label",
    inject(TreeItemScope).props
  ).state
}

/**
 * The arrow that expands and collapses a branch. Alt or Option expands everything in it.
 * @experimental
 */
@Directive({
  selector: "[uiTreeItemIndicator]",
  exportAs: "uiTreeItemIndicator",
})
class TreeItemIndicator {
  /** The item's state, as a signal. */
  readonly state = usePart(
    inject(Tree).handle,
    "indicator",
    inject(TreeItemScope).props
  ).state
}

/**
 * The item's checkbox, with `checkable`. Screen readers hear the item's checked state instead.
 * @experimental
 */
@Directive({
  selector: "[uiTreeItemCheckbox]",
  exportAs: "uiTreeItemCheckbox",
})
class TreeItemCheckbox {
  /** The item's state, as a signal. */
  readonly state = usePart(
    inject(Tree).handle,
    "checkbox",
    inject(TreeItemScope).props
  ).state
}

/**
 * A branch's children. Shown while the branch is expanded or animating closed. `*uiTreeGroup` renders it only then.
 * @experimental
 */
@Directive({ selector: "[uiTreeGroup]", exportAs: "uiTreeGroup" })
class TreeGroup {
  /** Whether the group stays in the page, hidden, while its branch is collapsed. Defaults to the tree's `keepMounted`. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })
  /** Whether a collapsed group stays in the page for the browser's find in page, which expands the branch on a match. Defaults to the tree's `hiddenUntilFound`. */
  readonly hiddenUntilFound = input(undefined, { transform: optionalBoolean })
  /** The inputs as one object, for the `*` form, which leaves other attributes on the element inside: `*uiTreeGroup="{ keepMounted: true }"`. */
  readonly uiTreeGroup: StarInput<TreeGroupProps> = input(undefined, {
    transform: starInputs<TreeGroupProps>,
  })

  readonly #item = inject(TreeItemScope)
  /** The group's state, as a signal. */
  readonly state = usePart(inject(Tree).handle, "group", () => ({
    ...withStar(this.uiTreeGroup(), {
      keepMounted: this.keepMounted(),
      hiddenUntilFound: this.hiddenUntilFound(),
    }),
    value: this.#item.value(),
  })).state

  constructor() {
    // The group makes its item a branch, in the page or not.
    this.#item.groups.update((count) => count + 1)
    inject(DestroyRef).onDestroy(() =>
      this.#item.groups.update((count) => count - 1)
    )
  }

  static ngTemplateContextGuard(
    _directive: TreeGroup,
    context: unknown
  ): context is { $implicit: TreeGroupState } {
    return true
  }
}

/**
 * Renders a data tree's items, inside the tree: its own `items`, or the
 * tree's. Its element only holds them and takes no space.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiTreeItems]",
  exportAs: "uiTreeItems",
  host: { style: "display: contents" },
  imports: [TreeGroup, TreeItem, TreeItemCheckbox, TreeItemLabel],
  template: `
    @for (item of shown(); track item.value) {
      <div
        uiTreeItem
        [value]="item.value"
        [branch]="item.children !== undefined"
        [disabled]="item.disabled"
      >
        @if (tree.checkable()) {
          <span uiTreeItemCheckbox></span>
        }
        @if (item.href) {
          <a uiTreeItemLabel [href]="item.href">{{ item.label }}</a>
        } @else {
          <span uiTreeItemLabel>{{ item.label }}</span>
        }
        @if (item.children) {
          <div *uiTreeGroup>
            <div uiTreeItems [items]="item.children"></div>
          </div>
        }
      </div>
    }
  `,
})
class TreeItems {
  /** The items to render. Without it, the tree's `items` or `paths`. */
  readonly items = input<TreeItemData[]>()

  protected readonly tree = inject(Tree)
  protected readonly shown = computed(() => {
    this.tree.items()
    this.tree.paths()
    return this.items() ?? this.tree.handle.api.internal.items() ?? []
  })
}

export {
  createTreeController,
  toggleTreeChecked,
  treeCheckedStates,
  treeFromPaths,
  visibleTreeRows,
} from "@ui-sdk/core/tree"
export type {
  ListHighlightDetails,
  TreeActionDetails,
  TreeAnnouncement,
  TreeApi,
  TreeChangeOptions,
  TreeCheckStrategy,
  TreeCheckedChangeReason,
  TreeCheckedState,
  TreeCollection,
  TreeCollectionNode,
  TreeController,
  TreeExpandedChangeReason,
  TreeGroupProps,
  TreeGroupState,
  TreeItemData,
  TreeItemPartProps,
  TreeItemProps,
  TreeItemState,
  TreeOptions,
  TreePrimitive,
  TreeState,
  TreeRow,
  TreeMode,
  TreeValue,
  TreeValueChangeReason,
} from "@ui-sdk/core/tree"

export {
  Tree,
  type TreeAction,
  type TreeCheckedChange,
  type TreeExpandedChange,
  TreeGroup,
  type TreeHighlight,
  TreeItem,
  TreeItemCheckbox,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeValueChange,
  TreeItems,
}
