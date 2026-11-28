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
  Autocomplete,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteItemText,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteSeparator,
  AutocompleteStatus,
  type AutocompleteSubmit,
  AutocompleteTrigger,
  type AutocompleteValueChange,
  type ListData,
} from "@ui-sdk/angular/autocomplete"
import {
  autocompleteFixture,
  autocompleteOptions,
  changedItems,
  searchFruits,
} from "../../../../../tests/fixtures/autocomplete"
import { onItemsChange } from "../../../../../tests/fixtures/items"
import { serializeForm } from "../../../../../tests/fixtures/select"
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

// The list's entries with the fixture's classes: items, and groups with their labels.
@Component({
  selector: "[fixtureEntries]",
  host: { style: "display: contents" },
  imports: [
    AutocompleteGroup,
    AutocompleteGroupLabel,
    AutocompleteItem,
    AutocompleteItemText,
    AutocompleteSeparator,
  ],
  template: `
    @for (entry of listed(); track entry.key) {
      @switch (entry.type) {
        @case ("separator") {
          <div uiAutocompleteSeparator></div>
        }
        @case ("group") {
          <div uiAutocompleteGroup>
            <div uiAutocompleteGroupLabel class="label">{{ entry.label }}</div>
            <div [fixtureEntries]="entry.items" [highlight]="highlight()"></div>
          </div>
        }
        @case ("item") {
          <div
            uiAutocompleteItem
            class="item"
            [value]="entry.value"
            [label]="entry.label"
            [keywords]="entry.keywords"
            [disabled]="entry.disabled"
          >
            @if (highlight()) {
              <span uiAutocompleteItemText>{{ entry.label }}</span>
            } @else {
              {{ entry.label }}
            }
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
  protected readonly listed = computed(() => this.entries().map(entryOf))
}

@Component({
  imports: [
    Autocomplete,
    AutocompleteClear,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteInput,
    AutocompleteLabel,
    AutocompleteList,
    AutocompleteStatus,
    AutocompleteTrigger,
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
            uiAutocomplete
            [name]="f.name"
            [container]="options.container"
            [items]="fromData ? items() : undefined"
            [emptyItems]="options.recent ? f.recent : undefined"
            [filter]="options.async ? false : undefined"
            [status]="options.async ? remote.state().status : undefined"
            [defaultValue]="options.defaultValue"
            [inlineComplete]="options.inlineComplete"
            [autoHighlight]="options.autoHighlight"
            [openOnFocus]="options.openOnFocus"
            [submitOnSelect]="options.submitOnSelect"
            [required]="options.required"
            [readOnly]="options.readOnly"
            [disabled]="options.disabled"
            [presentation]="options.presentation"
            (beforeValueChange)="onValueChange($event)"
            (submit)="onChoose($event)"
          >
            <label uiAutocompleteLabel class="label">{{ f.label }}</label>
            <input uiAutocompleteInput class="input" />
            <button uiAutocompleteTrigger [attr.aria-label]="f.trigger">
              ▾
            </button>
            <button *uiAutocompleteClear>{{ f.clear }}</button>
            <div *uiAutocompleteContent class="popup list-popup">
              @if (!options.nostatus) {
                <div
                  uiAutocompleteStatus
                  #status="uiAutocompleteStatus"
                  class="status"
                  [textContent]="status.state().loading ? 'Loading…' : ''"
                ></div>
              }
              <div uiAutocompleteEmpty class="empty">{{ f.empty }}</div>
              <div uiAutocompleteList #list="uiAutocompleteList">
                <div
                  [fixtureEntries]="fromData ? list.state().items : items()"
                  [highlight]="
                    options.highlight && (fromData || !options.grouped)
                  "
                ></div>
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
  readonly f = autocompleteFixture
  readonly options: ReturnType<typeof autocompleteOptions> & {
    defaultValue?: string
    container?: HTMLElement | null
  } = autocompleteOptions()
  readonly fromData = inject(DATA) || this.options.async || this.options.recent
  readonly remote = useAsyncOptions(searchFruits, {
    immediate: this.options.async,
  })
  readonly list = state<Item[]>(autocompleteFixture.items)
  readonly items = computed<ListData>(() => {
    if (this.options.async) {
      return this.remote.state().items
    }
    if (!this.options.grouped) {
      return this.list()
    }
    return autocompleteFixture.groups.map((group) => ({
      type: "group" as const,
      label: group.label,
      items: group.items,
    }))
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

  onValueChange(change: AutocompleteValueChange) {
    this.action.set(`value:${change.value}:${change.reason}`)
    if (this.options.async) {
      this.remote.setQuery(change.value)
    }
  }

  onChoose(submit: AutocompleteSubmit) {
    this.action.set(`submit:${submit.value}`)
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
