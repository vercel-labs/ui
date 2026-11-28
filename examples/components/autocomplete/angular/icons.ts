import { Component } from "@angular/core"
import {
  LucideArchive,
  LucideClock,
  LucideDynamicIcon,
  LucideFile,
  LucidePencil,
  LucideReply,
  LucideStar,
} from "@lucide/angular"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteItemIcon,
  AutocompleteList,
} from "@ui-sdk/angular/autocomplete"

@Component({
  imports: [
    Autocomplete,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteItemIcon,
    AutocompleteList,
    LucideDynamicIcon,
  ],
  template: `
    <ng-container uiAutocomplete>
      <input
        uiAutocompleteInput
        type="search"
        aria-label="Search mail"
        placeholder="Search mail…"
      />
      <div *uiAutocompleteContent>
        <div uiAutocompleteEmpty>No searches found.</div>
        <div uiAutocompleteList>
          @for (search of mailSearches; track search.value) {
            <div uiAutocompleteItem [value]="search.value">
              <span uiAutocompleteItemIcon [mirror]="search.mirror">
                <svg [lucideIcon]="search.icon"></svg>
              </span>
              {{ search.value }}
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly mailSearches = [
    { value: "Starred", icon: LucideStar },
    { value: "Drafts", icon: LucidePencil },
    { value: "Replies", icon: LucideReply, mirror: true },
    { value: "Attachments", icon: LucideFile },
    { value: "Archived", icon: LucideArchive },
    { value: "Scheduled", icon: LucideClock },
  ]
}

export { Example }
