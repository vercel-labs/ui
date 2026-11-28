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
        <input uiAutocompleteInput placeholder="e.g. Peach" />
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
              @for (fruit of group.fruits; track fruit) {
                <div uiAutocompleteItem [value]="fruit">{{ fruit }}</div>
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
      fruits: ["Apple", "Apricot", "Cherry", "Lemon", "Peach", "Pear"],
    },
    {
      label: "Berries",
      fruits: ["Blackberry", "Blueberry", "Grape", "Strawberry"],
    },
    { label: "Tropical", fruits: ["Avocado", "Banana", "Mango", "Pineapple"] },
  ]
}

export { Example }
