import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { useAsyncOptions } from "@ui-sdk/angular/async-options"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxStatus,
  ComboboxTrigger,
} from "@ui-sdk/angular/combobox"

@Component({
  imports: [
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxList,
    ComboboxStatus,
    ComboboxTrigger,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <ng-container
      uiCombobox
      [items]="movies.state().items"
      defaultQuery="the"
      [filter]="false"
      [status]="movies.state().status"
      (beforeQueryChange)="movies.setQuery($event.value)"
    >
      <div data-slot="stack">
        <label uiComboboxLabel>Movie</label>
        <div data-slot="row">
          <input uiComboboxInput placeholder="Search movies…" />
          <button uiComboboxTrigger aria-label="Show movies">
            <svg lucideChevronDown></svg>
          </button>
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxStatus #comboboxStatus="uiComboboxStatus">
          {{ comboboxStatus.state().status === 'error'
              ? 'Couldn't load movies.'
              : comboboxStatus.state().loading
                ? 'Searching…'
                : comboboxStatus.state().count + ' ' + (comboboxStatus.state().count === 1 ? 'movie' : 'movies') }}
        </div>
        <div uiComboboxEmpty #comboboxEmpty="uiComboboxEmpty">
          @if (comboboxEmpty.state().empty && !comboboxEmpty.state().loading) {
            No movies match “{{ comboboxEmpty.state().query }}”.
          }
        </div>
        <div uiComboboxList #comboboxList="uiComboboxList">
          @for (item of itemsOf(comboboxList.state().items); track item.value) {
            <div
              uiComboboxItem
              [value]="item.value"
              [label]="item.label"
              [disabled]="item.disabled"
            >
              {{ item.label }}
              <span *uiComboboxItemIndicator>
                <svg lucideCheck></svg>
              </span>
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly movieTitles = [
    "The Shawshank Redemption",
    "The Godfather",
    "The Dark Knight",
    "Pulp Fiction",
    "Schindler's List",
    "The Lord of the Rings",
    "Fight Club",
    "Forrest Gump",
    "Inception",
    "The Matrix",
    "Goodfellas",
    "Interstellar",
    "Parasite",
    "Spirited Away",
    "Whiplash",
    "The Prestige",
    "The Departed",
    "Gladiator",
    "Alien",
    "Casablanca",
    "Amélie",
    "Arrival",
  ]

  readonly searchMovies = (
    query: string,
    { signal }: { signal: AbortSignal }
  ) => {
    return new Promise<{ value: string; label: string }[]>(
      (resolve, reject) => {
        const timer = setTimeout(() => {
          const needle = query.trim().toLowerCase()
          resolve(
            this.movieTitles
              .filter((title) => title.toLowerCase().includes(needle))
              .map((title) => ({
                value: title.toLowerCase().replace(/\W+/g, "-"),
                label: title,
              }))
          )
        }, 500)
        signal.addEventListener("abort", () => {
          clearTimeout(timer)
          reject(signal.reason)
        })
      }
    )
  }

  readonly movies = useAsyncOptions(this.searchMovies, {
    debounce: 300,
    query: "the",
    immediate: true,
  })

  itemsOf(items: unknown) {
    return items as { value: string; label: string; disabled?: boolean }[]
  }
}

export { Example }
