import { Component } from "@angular/core"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteItemText,
  AutocompleteList,
} from "@ui-sdk/angular/autocomplete"
import { type ListAnnouncement } from "@ui-sdk/core/autocomplete"

const recent = ["react hooks", "tailwind grid", "web components", "vue v-model"]

const recentSearches = [
  { type: "group" as const, label: "Recent searches", items: recent },
]

@Component({
  imports: [
    Autocomplete,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteGroup,
    AutocompleteGroupLabel,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteItemText,
    AutocompleteList,
  ],
  template: `
    <ng-container
      uiAutocomplete
      [items]="topics"
      [emptyItems]="recentSearches"
      openOnFocus
      [announcement]="announcement"
    >
      <input
        uiAutocompleteInput
        type="search"
        aria-label="Search docs"
        placeholder="Search docs…"
      />
      <div *uiAutocompleteContent>
        <div uiAutocompleteEmpty>No topics found.</div>
        <div uiAutocompleteList #autocompleteList="uiAutocompleteList">
          @for (
            entry of itemsOf(autocompleteList.state().items);
            track typeof entry === "string" ? entry : entry.label
          ) {
            @if (typeof entry === "string") {
              <div uiAutocompleteItem [value]="entry">
                <span uiAutocompleteItemText></span>
              </div>
            } @else {
              <div uiAutocompleteGroup>
                <div uiAutocompleteGroupLabel>{{ entry.label }}</div>
                @for (topic of entry.items; track topic) {
                  <div uiAutocompleteItem [value]="topic">
                    <span uiAutocompleteItemText></span>
                  </div>
                }
              </div>
            }
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly recent = recent

  readonly topics = [
    ...this.recent,
    "react server components",
    "tailwind colors",
    "vue router",
  ]

  readonly recentSearches = recentSearches

  announcement(change: ListAnnouncement) {
    return change.type === "results"
      ? `${change.count} ${change.count === 1 ? "topic" : "topics"}`
      : null
  }

  itemsOf(items: unknown) {
    return items as (string | (typeof recentSearches)[number])[]
  }
}

export { Example }
