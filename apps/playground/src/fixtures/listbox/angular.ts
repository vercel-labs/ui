import { NgTemplateOutlet } from "@angular/common"
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  inject,
} from "@angular/core"
import {
  createListboxController,
  Listbox,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxItemIcon,
  ListboxItemIndicator,
  ListboxSeparator,
  type ListboxValueChange,
} from "@ui-sdk/angular/listbox"
import { onItemsChange } from "../../../../../tests/fixtures/items"
import {
  changedToppings,
  listboxAction,
  listboxFixture,
  type ListboxFixtureItem,
  listboxOptions,
  listboxData,
  longToppings,
} from "../../../../../tests/fixtures/listbox"
import { serializeForm } from "../../../../../tests/fixtures/select"
import { DATA, mountAngular, state } from "../../angular-mount"

type Value = string | string[] | null

@Component({
  imports: [
    Listbox,
    ListboxGroup,
    ListboxGroupLabel,
    ListboxItem,
    ListboxItemIcon,
    ListboxItemIndicator,
    ListboxSeparator,
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
        <ng-template #box>
          <div
            uiListbox
            class="listbox"
            [attr.aria-label]="f.label"
            [name]="f.name"
            [controller]="controller"
            [items]="items()"
            [value]="options.controlled ? value() : undefined"
            [defaultValue]="
              options.controlled ? undefined : options.defaultValue
            "
            [multiple]="options.multiple"
            [activation]="options.activation"
            [orientation]="options.orientation"
            [loop]="options.loop"
            [virtualFocus]="options.virtualFocus"
            [deselectable]="options.deselectable"
            [required]="options.required"
            [readOnly]="options.readOnly"
            [disabled]="options.disabled"
            (beforeValueChange)="onValueChange($event)"
          >
            @if (options.long) {
              @for (item of long; track item.value) {
                <div uiListboxItem class="item" [value]="item.value">
                  <span uiListboxItemIcon class="icon"></span>
                  {{ item.label }}
                  <span *uiListboxItemIndicator class="indicator">✓</span>
                </div>
              }
            } @else if (options.grouped) {
              @for (group of f.groups; track group.label; let index = $index) {
                @if (index > 0) {
                  <div uiListboxSeparator class="separator"></div>
                }
                <div uiListboxGroup class="group">
                  <div uiListboxGroupLabel class="label">{{ group.label }}</div>
                  @for (item of group.items; track item.value) {
                    <div uiListboxItem class="item" [value]="item.value">
                      <span uiListboxItemIcon class="icon"></span>
                      {{ item.label }}
                      <span *uiListboxItemIndicator class="indicator">✓</span>
                    </div>
                  }
                </div>
              }
            } @else {
              @for (item of list(); track item.value) {
                <div
                  uiListboxItem
                  class="item"
                  [value]="item.value"
                  [disabled]="item.disabled"
                >
                  <span uiListboxItemIcon class="icon"></span>
                  {{ item.label }}
                  <span *uiListboxItemIndicator class="indicator">✓</span>
                </div>
              }
            }
          </div>
        </ng-template>
        @if (options.fieldset) {
          <fieldset disabled>
            <ng-container [ngTemplateOutlet]="box" />
          </fieldset>
        } @else {
          <ng-container [ngTemplateOutlet]="box" />
        }
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Reason">{{ reason() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
      <button (click)="controller.clear()">{{ f.clear }}</button>
      <button (click)="controller.selectAll()">{{ f.selectAll }}</button>
    </div>
  `,
})
class Fixture {
  readonly f = listboxFixture
  readonly controller = createListboxController<string, boolean>()
  readonly options: ReturnType<typeof listboxOptions> & {
    defaultValue?: string | string[]
  } = listboxOptions()
  readonly long = longToppings()
  readonly list = state<ListboxFixtureItem[]>(listboxFixture.items)
  readonly data = inject(DATA)
  readonly items = computed(() => {
    if (!this.data) {
      return undefined
    }
    if (this.options.long) {
      return this.long
    }
    return this.options.grouped ? listboxData(true) : this.list()
  })
  readonly value = state<Value>(
    this.options.defaultValue ?? (this.options.multiple ? [] : null)
  )
  readonly action = state("")
  readonly reason = state("")
  readonly submitted = state("")

  constructor() {
    const destroyRef = inject(DestroyRef)
    // In the browser only: the server has no document.
    afterNextRender(() =>
      destroyRef.onDestroy(
        onItemsChange(changedToppings, (items) => this.list.set(items))
      )
    )
  }

  onValueChange(change: ListboxValueChange<Value>) {
    this.reason.set(change.reason)
    if (this.options.cancel) {
      return change.cancel()
    }
    this.value.set(change.value)
    this.action.set(listboxAction(change.value))
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.submitted.set(serializeForm(event.currentTarget as HTMLFormElement))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
