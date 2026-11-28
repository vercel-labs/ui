import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@ui-sdk/angular/autocomplete"

@Component({
  imports: [
    Autocomplete,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteList,
  ],
  template: `
    <form role="search" data-slot="stack" (submit)="$event.preventDefault()">
      <ng-container
        uiAutocomplete
        submitOnSelect
        name="q"
        (submit)="log('Searched “' + $event.value + '”')"
      >
        <input
          uiAutocompleteInput
          type="search"
          aria-label="Search"
          placeholder="Search…"
        />
        <div *uiAutocompleteContent>
          <div uiAutocompleteEmpty>No results.</div>
          <div uiAutocompleteList>
            @for (search of recent; track search) {
              <div uiAutocompleteItem [value]="search">
                {{ search }}
              </div>
            }
          </div>
        </div>
      </ng-container>
    </form>
  `,
})
class Example {
  readonly recent = [
    "react hooks",
    "tailwind grid",
    "web components",
    "vue v-model",
  ]

  readonly log = useLog()
}

export { Example }
