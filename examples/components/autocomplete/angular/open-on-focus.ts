import { Component } from "@angular/core"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
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
    AutocompleteList,
  ],
  template: `
    <ng-container uiAutocomplete openOnFocus>
      <input uiAutocompleteInput aria-label="Search" placeholder="Search…" />
      <div *uiAutocompleteContent>
        <div uiAutocompleteEmpty>No results.</div>
        <div uiAutocompleteList>
          <div uiAutocompleteGroup>
            <div uiAutocompleteGroupLabel>Recent searches</div>
            @for (search of recent; track search) {
              <div uiAutocompleteItem [value]="search">
                {{ search }}
              </div>
            }
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly recent = [
    "react hooks",
    "tailwind grid",
    "web components",
    "vue v-model",
  ]
}

export { Example }
