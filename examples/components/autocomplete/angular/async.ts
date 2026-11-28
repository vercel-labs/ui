import { Component } from "@angular/core"
import { useAsyncOptions } from "@ui-sdk/angular/async-options"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteStatus,
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
    AutocompleteStatus,
  ],
  template: `
    <ng-container
      uiAutocomplete
      [items]="results.state().items"
      [filter]="false"
      [status]="results.state().status"
      (beforeValueChange)="results.setQuery($event.value)"
      (loadMore)="results.loadMore()"
    >
      <div data-slot="stack">
        <label uiAutocompleteLabel>City</label>
        <input uiAutocompleteInput placeholder="e.g. Paris" />
      </div>
      <div *uiAutocompleteContent>
        <div uiAutocompleteStatus #autocompleteStatus="uiAutocompleteStatus">
          {{
            autocompleteStatus.state().loading
              ? "Searching…"
              : autocompleteStatus.state().count
                ? autocompleteStatus.state().count +
                  " " +
                  (autocompleteStatus.state().count === 1 ? "city" : "cities")
                : ""
          }}
        </div>
        <div uiAutocompleteEmpty #autocompleteEmpty="uiAutocompleteEmpty">
          @if (
            autocompleteEmpty.state().empty &&
            !autocompleteEmpty.state().loading
          ) {
            No cities start with “{{ autocompleteEmpty.state().query }}”.
          }
        </div>
        <div uiAutocompleteList #autocompleteList="uiAutocompleteList">
          @for (city of itemsOf(autocompleteList.state().items); track city) {
            <div uiAutocompleteItem [value]="city">
              {{ city }}
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly searchCities = (
    query: string,
    { signal }: { signal: AbortSignal }
  ) => {
    const cities = [
      "Amsterdam",
      "Athens",
      "Barcelona",
      "Berlin",
      "Boston",
      "Brussels",
      "Buenos Aires",
      "Cairo",
      "Chicago",
      "Copenhagen",
      "Dublin",
      "Lisbon",
      "London",
      "Los Angeles",
      "Madrid",
      "Paris",
      "Prague",
      "Rome",
      "Seoul",
      "Tokyo",
    ]
    return new Promise<string[]>((resolve, reject) => {
      const timer = setTimeout(() => {
        const needle = query.trim().toLowerCase()
        resolve(cities.filter((city) => city.toLowerCase().startsWith(needle)))
      }, 300)
      signal.addEventListener("abort", () => {
        clearTimeout(timer)
        reject(new DOMException("Aborted", "AbortError"))
      })
    })
  }

  readonly results = useAsyncOptions(this.searchCities, { debounce: 200 })

  itemsOf(items: unknown) {
    return items as string[]
  }
}

export { Example }
