import { Component } from "@angular/core"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
} from "@ui-sdk/angular/autocomplete"

@Component({
  imports: [
    Autocomplete,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteLabel,
    AutocompleteList,
  ],
  template: `
    <div #box data-slot="card">
      <ng-container uiAutocomplete modal="pointer" [container]="box">
        <div data-slot="stack">
          <label uiAutocompleteLabel>Fruit</label>
          <input uiAutocompleteInput />
        </div>
        <div
          *uiAutocompleteContent="{
            side: 'top',
            align: 'end',
            sideOffset: 10,
            alignOffset: -4,
            collisionPadding: 8,
            anchor: box,
            keepMounted: true,
          }"
        >
          <div uiAutocompleteEmpty>No fruits found.</div>
          <div uiAutocompleteList>
            @for (fruit of fruits; track fruit) {
              <div uiAutocompleteItem [value]="fruit">
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
  ]
}

export { Example }
