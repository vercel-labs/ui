import { NgTemplateOutlet } from "@angular/common"
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
} from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  createSelectController,
  type ListData,
  Select,
  SelectClear,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectItems,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectSelectAll,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectValueChange,
} from "@ui-sdk/angular/select"
import { onItemsChange } from "../../../../../tests/fixtures/items"
import {
  changedItems,
  longItems,
  selectFixture,
  selectOptions,
  serializeForm,
} from "../../../../../tests/fixtures/select"
import { DATA, mountAngular, state } from "../../angular-mount"

type Item = { value: string; label: string; disabled?: boolean }

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

// The list's entries with the fixture's classes: items with their check,
// groups with their labels, and separators.
@Component({
  selector: "[fixtureEntries]",
  host: { style: "display: contents" },
  imports: [
    SelectGroup,
    SelectGroupLabel,
    SelectItem,
    SelectItemIndicator,
    SelectItemText,
    SelectSelectAll,
    SelectSeparator,
  ],
  template: `
    @for (entry of listed(); track entry.key) {
      @switch (entry.type) {
        @case ("separator") {
          <div uiSelectSeparator class="separator"></div>
        }
        @case ("group") {
          <div uiSelectGroup>
            <div uiSelectGroupLabel class="label">{{ entry.label }}</div>
            @if (selectAll()) {
              <div *uiSelectSelectAll class="item">
                {{ selectAll() }} {{ entry.label }}
              </div>
            }
            <div [fixtureEntries]="entry.items"></div>
          </div>
        }
        @case ("item") {
          <div
            uiSelectItem
            class="item"
            [value]="entry.value"
            [disabled]="entry.disabled"
          >
            <span uiSelectItemText>{{ entry.label }}</span>
            <span *uiSelectItemIndicator class="indicator">✓</span>
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
  /** The label of each group's select-all option, when groups have one. */
  readonly selectAll = input<string>()
  protected readonly listed = computed(() => this.entries().map(entryOf))
}

// ?wrapped renders the data list through a content part inside a component
// of the app's own, as a styled layer does.
@Component({
  selector: "fixture-styled-content",
  host: { style: "display: contents" },
  imports: [SelectContent, SelectItems],
  template: `
    <div *uiSelectContent class="popup list-popup">
      <div uiSelectItems></div>
    </div>
  `,
})
class StyledContent {}

@Component({
  imports: [
    Entries,
    Field,
    FieldLabel,
    NgTemplateOutlet,
    Select,
    SelectClear,
    SelectContent,
    SelectEmpty,
    SelectInput,
    SelectLabel,
    SelectList,
    SelectSelectAll,
    SelectTrigger,
    SelectValue,
    StyledContent,
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
          @if (options.field) {
            <div uiField>
              <label uiFieldLabel class="label">{{ f.label }}</label>
              <button uiSelectTrigger class="trigger" [controller]="controller">
                <span
                  uiSelectValue
                  class="value"
                  [maxLabels]="options.max"
                ></span>
                <span aria-hidden="true">▾</span>
              </button>
            </div>
          }
          <ng-container
            uiSelect
            [name]="f.name"
            [placeholder]="f.placeholder"
            [controller]="controller"
            [container]="options.container"
            [items]="fromData ? items() : undefined"
            [emptyItems]="options.recent ? f.recent : undefined"
            [multiple]="options.multiple"
            [defaultValue]="options.defaultValue"
            [required]="options.required"
            [readOnly]="options.readOnly"
            [disabled]="options.disabled"
            [virtualFocus]="options.virtualFocus"
            [defaultOpen]="options.defaultOpen"
            [modal]="options.modal"
            [presentation]="options.presentation"
            (beforeValueChange)="onValueChange($event)"
          >
            @if (!options.field) {
              <div uiSelectLabel class="label">{{ f.label }}</div>
              <button uiSelectTrigger class="trigger">
                <span
                  uiSelectValue
                  class="value"
                  [maxLabels]="options.max"
                ></span>
                <span aria-hidden="true">▾</span>
              </button>
            }
            <button *uiSelectClear>{{ f.clear }}</button>
            @if (wrapped) {
              <fixture-styled-content />
            } @else if (options.search) {
              <div
                *uiSelectContent="{ alignItemWithTrigger: options.align }"
                class="popup list-popup"
              >
                <input
                  uiSelectInput
                  class="input"
                  [attr.aria-label]="f.search"
                />
                <div uiSelectEmpty class="empty">{{ f.empty }}</div>
                <div uiSelectList #list="uiSelectList">
                  @if (options.selectAll && !options.grouped) {
                    <div *uiSelectSelectAll class="item">{{ f.selectAll }}</div>
                  }
                  @if (fromData) {
                    <div [fixtureEntries]="list.state().items"></div>
                  } @else {
                    <div
                      [fixtureEntries]="items()"
                      [selectAll]="options.selectAll ? f.selectAll : undefined"
                    ></div>
                  }
                </div>
              </div>
            } @else if (fromData) {
              <div *uiSelectContent="let content" class="popup list-popup">
                @if (options.selectAll) {
                  <div *uiSelectSelectAll class="item">{{ f.selectAll }}</div>
                }
                <div [fixtureEntries]="content.items"></div>
              </div>
            } @else {
              <div
                *uiSelectContent="{ alignItemWithTrigger: options.align }"
                class="popup list-popup"
              >
                @if (options.selectAll && !options.grouped) {
                  <div *uiSelectSelectAll class="item">{{ f.selectAll }}</div>
                }
                <div
                  [fixtureEntries]="items()"
                  [selectAll]="options.selectAll ? f.selectAll : undefined"
                ></div>
              </div>
            }
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
      <button (click)="controller.open()">Open with controller</button>
    </div>
  `,
})
class Fixture {
  readonly f = selectFixture
  readonly controller = createSelectController<string, boolean>()
  readonly options: ReturnType<typeof selectOptions> & {
    max?: number
    defaultValue?: string | string[]
    virtualFocus?: boolean
    defaultOpen?: boolean
    modal?: boolean
    container?: HTMLElement | null
  } = selectOptions()
  readonly wrapped = new URLSearchParams(location.search).has("wrapped")
  readonly fromData =
    inject(DATA) || this.options.long || this.options.recent || this.wrapped
  readonly list = state<Item[]>(selectFixture.items)
  readonly long = this.options.long ? longItems() : []
  readonly items = computed<ListData>(() => {
    if (this.options.long) {
      return this.long
    }
    if (!this.options.grouped) {
      return this.list()
    }
    const [first, second] = selectFixture.groups
    return [
      { type: "group", label: first.label, items: first.items },
      { type: "separator" },
      { type: "group", label: second.label, items: second.items },
    ]
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

  onValueChange(change: SelectValueChange<string | string[] | null>) {
    if (this.options.cancel) {
      return change.cancel()
    }
    const { value } = change
    this.action.set(
      `value:${Array.isArray(value) ? value.join(",") : String(value)}`
    )
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
