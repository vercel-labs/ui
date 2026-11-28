import { Component } from "@angular/core"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteTrigger,
} from "@ui-sdk/angular/autocomplete"
import { autocompleteFixture as f } from "../../../../../tests/fixtures/autocomplete"
import { mountAngular } from "../../angular-mount"

@Component({
  imports: [
    Autocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteLabel,
    AutocompleteList,
    AutocompleteTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiAutocomplete [name]="f.name">
        <label uiAutocompleteLabel class="label">{{ f.label }}</label>
        <input
          uiAutocompleteInput
          #input="uiAutocompleteInput"
          class="input"
          [class.is-open]="input.state().open"
          [class.is-closed]="!input.state().open"
        />
        <button uiAutocompleteTrigger [attr.aria-label]="f.trigger">▾</button>
        <div *uiAutocompleteContent class="popup list-popup">
          <div uiAutocompleteList>
            <a
              uiAutocompleteItem
              class="item"
              value="docs"
              label="Docs"
              href="#docs"
              >Docs</a
            >
            @for (item of items; track item.value) {
              <div
                uiAutocompleteItem
                #row="uiAutocompleteItem"
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
