import { Component } from "@angular/core"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
} from "@ui-sdk/angular/autocomplete"

@Component({
  imports: [
    Autocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteLabel,
    AutocompleteList,
  ],
  template: `
    <div data-slot="stack">
      <ng-container uiAutocomplete disabled defaultValue="Banana">
        <div data-slot="stack">
          <label uiAutocompleteLabel>Disabled</label>
          <input uiAutocompleteInput />
        </div>
      </ng-container>
      <ng-container uiAutocomplete readOnly defaultValue="Cherry">
        <div data-slot="stack">
          <label uiAutocompleteLabel>Read-only</label>
          <input uiAutocompleteInput />
        </div>
      </ng-container>
      <ng-container uiAutocomplete>
        <div data-slot="stack">
          <label uiAutocompleteLabel>Some suggestions disabled</label>
          <input uiAutocompleteInput placeholder="Type “b”" />
        </div>
        <div *uiAutocompleteContent>
          <div uiAutocompleteList>
            @for (fruit of fruits; track fruit; let index = $index) {
              <div
                uiAutocompleteItem
                [value]="fruit"
                [disabled]="index % 3 === 0"
              >
                {{ fruit }}
              </div>
            }
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly fruits = [
    "Apple",
    "Apricot",
    "Avocado",
    "Banana",
    "Blackberry",
    "Blueberry",
    "Cherry",
    "Grape",
    "Lemon",
    "Mango",
    "Orange",
    "Peach",
    "Pear",
    "Pineapple",
    "Strawberry",
  ]
}

export { Example }
