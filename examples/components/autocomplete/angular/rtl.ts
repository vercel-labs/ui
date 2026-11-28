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
    <div dir="rtl">
      <ng-container uiAutocomplete inlineComplete>
        <div data-slot="stack">
          <label uiAutocompleteLabel>المدينة</label>
          <input uiAutocompleteInput placeholder="مثلاً: دبي" />
        </div>
        <div *uiAutocompleteContent>
          <div uiAutocompleteList>
            @for (city of cities; track city) {
              <div uiAutocompleteItem [value]="city">
                {{ city }}
              </div>
            }
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly cities = [
    "القاهرة",
    "القدس",
    "الرباط",
    "الرياض",
    "بيروت",
    "دبي",
    "عمّان",
  ]
}

export { Example }
