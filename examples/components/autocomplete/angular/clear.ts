import { Component } from "@angular/core"
import { LucideChevronDown, LucideX } from "@lucide/angular"
import {
  Autocomplete,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteTrigger,
} from "@ui-sdk/angular/autocomplete"

@Component({
  imports: [
    Autocomplete,
    AutocompleteClear,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteLabel,
    AutocompleteList,
    AutocompleteTrigger,
    LucideChevronDown,
    LucideX,
  ],
  template: `
    <ng-container uiAutocomplete defaultValue="Mango">
      <div data-slot="stack">
        <label uiAutocompleteLabel>Fruit</label>
        <div data-slot="row">
          <input uiAutocompleteInput />
          <button *uiAutocompleteClear aria-label="Clear">
            <svg lucideX></svg>
          </button>
          <button uiAutocompleteTrigger aria-label="Show fruits">
            <svg lucideChevronDown></svg>
          </button>
        </div>
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
