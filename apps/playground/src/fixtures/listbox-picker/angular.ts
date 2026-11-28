import {
  afterNextRender,
  Component,
  DestroyRef,
  type ElementRef,
  inject,
  input,
  viewChild,
} from "@angular/core"
import { Listbox, ListboxItem } from "@ui-sdk/angular/listbox"
import { bindScrollPicker } from "@ui-sdk/core"
import {
  type PickerFixture,
  pickerFixtures,
} from "../../../../../tests/fixtures/listbox-picker"
import { mountAngular, state } from "../../angular-mount"

@Component({
  selector: "fixture-picker",
  host: { style: "display: contents" },
  imports: [Listbox, ListboxItem],
  template: `
    <div
      #list
      uiListbox
      class="picker"
      [attr.aria-label]="picker().label"
      [orientation]="picker().orientation"
      [keepInView]="false"
      [value]="current()"
      (valueChange)="choose($event)"
    >
      @for (item of picker().items; track item.value) {
        <div
          uiListboxItem
          class="picker-item"
          [value]="item.value"
          [disabled]="item.disabled"
          [textContent]="item.value"
        ></div>
      }
    </div>
    <output role="status" [attr.aria-label]="picker().label + ' changes'">{{
      changes().join(",")
    }}</output>
  `,
})
class Picker {
  readonly picker = input.required<PickerFixture>()
  readonly list = viewChild.required<ElementRef<HTMLElement>>("list")
  readonly value = state<string | null | undefined>(undefined)
  readonly changes = state<string[]>([])

  constructor() {
    const destroyed = inject(DestroyRef)
    afterNextRender(() =>
      destroyed.onDestroy(
        bindScrollPicker(this.list().nativeElement, {
          onSelect: (index) => this.choose(this.picker().items[index]!.value),
        })
      )
    )
  }

  current() {
    const value = this.value()
    return value === undefined ? this.picker().defaultValue : value
  }

  choose(next: string | null) {
    this.value.set(next)
    this.changes.set([...this.changes(), String(next)])
  }
}

@Component({
  imports: [Picker],
  template: `
    <div class="fixture">
      <button>Before</button>
      @for (picker of pickers; track picker.label) {
        <fixture-picker [picker]="picker" />
      }
      <button>After</button>
    </div>
  `,
})
class Fixture {
  readonly pickers = pickerFixtures
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount, Picker }
