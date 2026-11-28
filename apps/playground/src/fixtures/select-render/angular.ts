import { Component } from "@angular/core"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"
import { selectFixture as f } from "../../../../../tests/fixtures/select"
import { mountAngular } from "../../angular-mount"

@Component({
  imports: [
    Select,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiSelect [name]="f.name" [placeholder]="f.placeholder">
        <div uiSelectLabel class="label">{{ f.label }}</div>
        <button
          uiSelectTrigger
          #trigger="uiSelectTrigger"
          class="trigger"
          [class.is-open]="trigger.state().open"
          [class.is-closed]="!trigger.state().open"
        >
          <span uiSelectValue></span>
          <span aria-hidden="true">{{ trigger.state().open ? "▲" : "▼" }}</span>
        </button>
        <div *uiSelectContent class="popup list-popup">
          <a uiSelectItem class="item" value="docs" href="#docs">Docs</a>
          @for (item of items; track item.value) {
            <div uiSelectItem class="item" [value]="item.value">
              {{ item.label }}
            </div>
          }
        </div>
      </ng-container>
      <button>After</button>
    </div>
  `,
})
class Fixture {
  readonly f = f
  readonly items = f.items.slice(0, 3)
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
