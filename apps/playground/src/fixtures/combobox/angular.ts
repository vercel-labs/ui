import { NgTemplateOutlet } from "@angular/common"
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
} from "@angular/core"
import { useAsyncOptions } from "@ui-sdk/angular/async-options"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxChipsOverflow,
  ComboboxClear,
  ComboboxContent,
  ComboboxCreate,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  type ComboboxQueryChange,
  ComboboxSelectAll,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
  type ComboboxValueChange,
  type ListData,
} from "@ui-sdk/angular/combobox"
import {
  cancelsValue,
  changedItems,
  comboboxFixture,
  comboboxOptions,
  createDelay,
  searchCountries,
  searchCountryPages,
} from "../../../../../tests/fixtures/combobox"
import { onItemsChange } from "../../../../../tests/fixtures/items"
import { longItems, serializeForm } from "../../../../../tests/fixtures/select"
import { DATA, mountAngular, state } from "../../angular-mount"

type Item = {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
}

type Entry =
  | ({ type: "item"; key: string } & Item)
  | { type: "group"; key: string; label?: string; items: ListData<unknown> }
  | { type: "separator"; key: string }

function entryOf(entry: ListData<unknown>[number], index: number): Entry {
  if (typeof entry === "string") {
    return { type: "item", key: entry, value: entry, label: entry }
  }
  if ("value" in entry) {
    return { type: "item", key: String(entry.value), ...(entry as Item) }
  }
  if (entry.type === "separator") {
    return { type: "separator", key: `separator-${index}` }
  }
  return {
    type: "group",
    key: `group-${entry.label ?? index}`,
    label: entry.label,
    items: entry.items,
  }
}

// The list's entries with the fixture's classes: items with their check, and
// groups with their labels.
@Component({
  selector: "[fixtureEntries]",
  host: { style: "display: contents" },
  imports: [
    ComboboxGroup,
    ComboboxGroupLabel,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxItemText,
    ComboboxSelectAll,
    ComboboxSeparator,
  ],
  template: `
    @for (entry of listed(); track entry.key) {
      @switch (entry.type) {
        @case ("separator") {
          <div uiComboboxSeparator></div>
        }
        @case ("group") {
          <div uiComboboxGroup>
            <div uiComboboxGroupLabel class="label">{{ entry.label }}</div>
            @if (selectAll()) {
              <div *uiComboboxSelectAll class="item">
                {{ selectAll() }} {{ entry.label }}
              </div>
            }
            <div [fixtureEntries]="entry.items" [highlight]="highlight()"></div>
          </div>
        }
        @case ("item") {
          <div
            uiComboboxItem
            class="item"
            [value]="entry.value"
            [label]="entry.label"
            [keywords]="entry.keywords"
            [disabled]="entry.disabled"
          >
            @if (highlight()) {
              <span uiComboboxItemText>{{ entry.label }}</span>
            } @else {
              {{ entry.label }}
            }
            <span *uiComboboxItemIndicator class="indicator">✓</span>
          </div>
        }
      }
    }
  `,
})
class Entries {
  readonly entries = input.required<ListData<unknown>>({
    alias: "fixtureEntries",
  })
  readonly highlight = input(false)
  /** The label of each group's select-all option, when groups have one. */
  readonly selectAll = input<string>()
  protected readonly listed = computed(() => this.entries().map(entryOf))
}

@Component({
  imports: [
    Combobox,
    ComboboxChip,
    ComboboxChipRemove,
    ComboboxChips,
    ComboboxChipsOverflow,
    ComboboxClear,
    ComboboxContent,
    ComboboxCreate,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxLabel,
    ComboboxList,
    ComboboxSelectAll,
    ComboboxStatus,
    ComboboxTrigger,
    ComboboxValue,
    Entries,
    NgTemplateOutlet,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="select-form"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
      >
        <ng-template #control>
          <ng-container
            uiCombobox
            [name]="f.name"
            [container]="options.container"
            [items]="fromData ? items() : undefined"
            [emptyItems]="options.recent ? f.recent : undefined"
            [filter]="loads ? false : undefined"
            [status]="loads ? remote.state().status : undefined"
            [itemToLabel]="options.labelsFromItems ? undefined : labelOf()"
            [multiple]="options.multiple"
            [defaultValue]="options.defaultValue"
            [maxSelected]="options.maxSelected"
            [required]="options.required"
            [readOnly]="options.readOnly"
            [disabled]="options.disabled"
            [autoHighlight]="options.autoHighlight"
            [modal]="options.modal"
            [presentation]="options.presentation"
            (loadMore)="options.pages && remote.loadMore()"
            (beforeValueChange)="onValueChange($event)"
            (beforeQueryChange)="onQueryChange($event)"
          >
            <label uiComboboxLabel class="label">{{ f.label }}</label>
            @if (options.multiple) {
              <div
                uiComboboxChips
                class="chips"
                [class.chips-line]="options.overflow"
              >
                <ng-container *uiComboboxValue="let selected">
                  @for (item of valuesOf(selected.value); track item) {
                    <span uiComboboxChip class="chip" [value]="item">
                      {{ labels().get(item) ?? item }}
                      <button
                        uiComboboxChipRemove
                        [attr.aria-label]="
                          'Remove ' + (labels().get(item) ?? item)
                        "
                      >
                        ×
                      </button>
                    </span>
                  }
                </ng-container>
                @if (options.overflow) {
                  <span uiComboboxChipsOverflow class="chips-overflow"></span>
                }
                <input uiComboboxInput class="input" />
              </div>
            } @else {
              <input uiComboboxInput class="input" />
            }
            @if (options.summary) {
              <output [attr.aria-label]="f.summary">
                <span uiComboboxValue [maxLabels]="options.summary"></span>
              </output>
            }
            <button uiComboboxTrigger [attr.aria-label]="f.trigger">▾</button>
            <button *uiComboboxClear>{{ f.clear }}</button>
            <div
              *uiComboboxContent
              class="popup list-popup"
              [class.list-short]="options.pages"
            >
              @if (!options.nostatus) {
                <div
                  uiComboboxStatus
                  #status="uiComboboxStatus"
                  class="status"
                  [textContent]="loadingText(status.state().loading)"
                ></div>
              }
              <div uiComboboxEmpty class="empty">{{ f.empty }}</div>
              <div uiComboboxList #list="uiComboboxList">
                @if (options.selectAll && (fromData || !options.grouped)) {
                  <div *uiComboboxSelectAll class="item">{{ f.selectAll }}</div>
                }
                <div
                  [fixtureEntries]="fromData ? list.state().items : items()"
                  [highlight]="options.highlight"
                  [selectAll]="
                    !fromData && options.selectAll ? f.selectAll : undefined
                  "
                ></div>
                @if (options.create) {
                  <div
                    uiComboboxCreate
                    class="item"
                    (create)="$event.waitUntil(onCreate($event.query))"
                  ></div>
                }
              </div>
            </div>
          </ng-container>
        </ng-template>
        @if (options.fieldset) {
          <fieldset disabled>
            <ng-container [ngTemplateOutlet]="control" />
          </fieldset>
        } @else {
          <ng-container [ngTemplateOutlet]="control" />
        }
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = comboboxFixture
  readonly options: ReturnType<typeof comboboxOptions> & {
    summary?: number
    defaultValue?: string | string[]
    maxSelected?: number
    container?: HTMLElement | null
    modal?: false
  } = comboboxOptions()
  readonly loads = this.options.async || this.options.pages
  readonly fromData =
    inject(DATA) || this.loads || this.options.long || this.options.recent
  readonly remote = useAsyncOptions<Item>(
    this.options.pages ? searchCountryPages : searchCountries,
    { immediate: this.loads }
  )
  readonly list = state<Item[]>(comboboxFixture.items)
  readonly created = state<Item[]>([])
  readonly long = this.options.long ? longItems() : []
  readonly items = computed<ListData<unknown>>(() => {
    if (this.loads) {
      return this.remote.state().items
    }
    if (this.options.long) {
      return this.long
    }
    if (!this.options.grouped) {
      return [...this.list(), ...this.created()]
    }
    return comboboxFixture.groups.map((group) => ({
      type: "group" as const,
      label: group.label,
      items: group.items,
    }))
  })
  readonly labels = computed(
    () =>
      new Map(
        [...comboboxFixture.items, ...this.list(), ...this.created()].map(
          (item) => [item.value, item.label]
        )
      )
  )
  readonly labelOf = computed(() => {
    const labels = this.labels()
    return (value: string) => labels.get(value) ?? value
  })
  readonly action = state("")
  readonly submitted = state("")

  constructor() {
    const destroyRef = inject(DestroyRef)
    // In the browser only: the server has no document.
    afterNextRender(() =>
      destroyRef.onDestroy(
        onItemsChange(changedItems, (items) => this.list.set(items))
      )
    )
  }

  // Bound as text, so the status stays empty, with no padding, while nothing loads.
  loadingText(loading: boolean) {
    return loading ? (this.options.pages ? "Loading more…" : "Loading…") : ""
  }

  valuesOf(value: unknown) {
    return value as string[]
  }

  onValueChange(change: ComboboxValueChange<string | string[] | null>) {
    const { value } = change
    if (cancelsValue(value, this.options.cancel)) {
      return change.cancel()
    }
    this.action.set(
      `value:${Array.isArray(value) ? value.join(",") : String(value)}`
    )
  }

  onQueryChange(change: ComboboxQueryChange) {
    if (this.loads) {
      this.remote.setQuery(change.value)
    }
  }

  async onCreate(query: string) {
    this.action.set(`create:${query}`)
    await createDelay(this.options.slow)
    this.created.update((list) => [
      ...list,
      { value: query.toLowerCase(), label: query },
    ])
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.submitted.set(serializeForm(event.currentTarget as HTMLFormElement))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Entries, Fixture, mount }
