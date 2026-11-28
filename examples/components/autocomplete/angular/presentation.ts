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
    <ng-container uiAutocomplete presentation="sheet">
      <div data-slot="stack">
        <label uiAutocompleteLabel>Favorite fruit</label>
        <input uiAutocompleteInput placeholder="e.g. Mango" />
      </div>
      <div *uiAutocompleteContent>
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
