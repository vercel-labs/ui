import { Component } from "@angular/core"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
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
    <ng-container uiAutocomplete>
      <div data-slot="stack">
        <label uiAutocompleteLabel>Jump to</label>
        <input uiAutocompleteInput placeholder="e.g. Styling" />
      </div>
      <div *uiAutocompleteContent>
        <div uiAutocompleteEmpty>No sections found.</div>
        <div uiAutocompleteList>
          @for (page of pages; track page.href) {
            <a
              uiAutocompleteItem
              [value]="page.title"
              [label]="page.title"
              [href]="page.href"
            >
              {{ page.title }}
              <span data-slot="hint">{{ page.section }}</span>
            </a>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly pages = [
    { title: "Installation", section: "Get Started", href: "#installation" },
    { title: "Composition", section: "Concepts", href: "#composition" },
    { title: "Build Your Own", section: "Concepts", href: "#build-your-own" },
    { title: "Styling", section: "Guides", href: "#styling" },
    { title: "API Reference", section: "Reference", href: "#api-reference" },
    { title: "Accessibility", section: "Reference", href: "#accessibility" },
  ]
}

export { Example }
