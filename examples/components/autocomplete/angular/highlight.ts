import { Component } from "@angular/core"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteItemText,
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
    AutocompleteItemText,
    AutocompleteLabel,
    AutocompleteList,
  ],
  template: `
    <ng-container uiAutocomplete>
      <div data-slot="stack">
        <label uiAutocompleteLabel>Favorite fruit</label>
        <input uiAutocompleteInput placeholder="e.g. berry" />
      </div>
      <div *uiAutocompleteContent>
        <div uiAutocompleteEmpty>No fruits found.</div>
        <div uiAutocompleteList>
          @for (fruit of fruits; track fruit) {
            <div uiAutocompleteItem [value]="fruit">
              <span
                uiAutocompleteItemText
                #autocompleteItemText="uiAutocompleteItemText"
              >
                @for (
                  segment of autocompleteItemText.state().segments;
                  track index;
                  let index = $index
                ) {
                  @if (segment.match) {
                    <strong>{{ segment.text }}</strong>
                  } @else {
                    <span>{{ segment.text }}</span>
                  }
                }
              </span>
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
