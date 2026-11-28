import { Component } from "@angular/core"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/angular/combobox"
import { comboboxFixture as f } from "../../../../../tests/fixtures/combobox"
import { mountAngular } from "../../angular-mount"

@Component({
  imports: [
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiCombobox [name]="f.name">
        <label uiComboboxLabel class="label">{{ f.label }}</label>
        <input
          uiComboboxInput
          #input="uiComboboxInput"
          class="input"
          [class.is-open]="input.state().open"
          [class.is-closed]="!input.state().open"
        />
        <button uiComboboxTrigger [attr.aria-label]="f.trigger">▾</button>
        <div *uiComboboxContent class="popup list-popup">
          <div uiComboboxList>
            <a
              uiComboboxItem
              class="item"
              value="docs"
              label="Docs"
              href="#docs"
              >Docs</a
            >
            @for (item of items; track item.value) {
              <div
                uiComboboxItem
                #row="uiComboboxItem"
                class="item"
                [value]="item.value"
                [label]="item.label"
                [textContent]="
                  item.label + (row.state().highlighted ? ' ←' : '')
                "
              ></div>
            }
          </div>
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
