import { Component } from "@angular/core"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteSeparator,
} from "@ui-sdk/angular/autocomplete"

@Component({
  imports: [
    Autocomplete,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteGroup,
    AutocompleteGroupLabel,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteLabel,
    AutocompleteList,
    AutocompleteSeparator,
  ],
  template: `
    <ng-container uiAutocomplete>
      <div data-slot="stack">
        <label uiAutocompleteLabel>Fruit</label>
        <input uiAutocompleteInput placeholder="e.g. Pear" />
      </div>
      <div *uiAutocompleteContent>
        <div uiAutocompleteEmpty>No fruits found.</div>
        <div uiAutocompleteList>
          @for (group of fruitGroups; track group.label; let index = $index) {
            @if (index > 0) {
              <div uiAutocompleteSeparator></div>
            }
            <div uiAutocompleteGroup>
              <div uiAutocompleteGroupLabel>{{ group.label }}</div>
              @for (fruit of group.items; track fruit) {
                <div uiAutocompleteItem [value]="fruit">
                  {{ fruit }}
                </div>
              }
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly fruitGroups = [
    {
      label: "Tree fruits",
      items: ["Apple", "Apricot", "Cherry", "Lemon", "Peach", "Pear"],
    },
    {
      label: "Berries",
      items: ["Blackberry", "Blueberry", "Grape", "Strawberry"],
    },
    { label: "Tropical", items: ["Avocado", "Banana", "Mango", "Pineapple"] },
  ]
}

export { Example }
