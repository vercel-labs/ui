import { Component } from "@angular/core"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  createAutocompleteController,
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
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" data-size="sm" (click)="fruit.open()">
          Open
        </button>
        <button type="button" data-size="sm" (click)="fruit.setValue('Pea')">
          Type “Pea”
        </button>
        <button type="button" data-size="sm" (click)="fruit.clear()">
          Clear
        </button>
        <button type="button" data-size="sm" (click)="fruit.focus()">
          Focus
        </button>
      </div>
      <ng-container uiAutocomplete [controller]="fruit">
        <label uiAutocompleteLabel>Fruit</label>
        <input uiAutocompleteInput />
        <div *uiAutocompleteContent>
          <div uiAutocompleteEmpty>No fruits found.</div>
          <div uiAutocompleteList>
            @for (item of fruits; track item) {
              <div uiAutocompleteItem [value]="item">
                {{ item }}
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

  readonly fruit = createAutocompleteController()
}

export { Example }
