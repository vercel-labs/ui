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
    <ng-container uiAutocomplete filter="startsWith">
      <div data-slot="stack">
        <label uiAutocompleteLabel>Tag</label>
        <input uiAutocompleteInput placeholder="Try “bug”" />
      </div>
      <div *uiAutocompleteContent>
        <div uiAutocompleteEmpty>No tags found.</div>
        <div uiAutocompleteList>
          @for (tag of tags; track tag.value) {
            <div
              uiAutocompleteItem
              [value]="tag.value"
              [label]="tag.label"
              [keywords]="tag.keywords"
            >
              {{ tag.label }}
              <span data-slot="hint">{{ tag.keywords[0] }}</span>
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly tags = [
    {
      value: "feature",
      label: "feature",
      keywords: ["enhancement", "request"],
    },
    { value: "fix", label: "fix", keywords: ["bug", "patch"] },
    { value: "docs", label: "docs", keywords: ["documentation", "readme"] },
    { value: "performance", label: "performance", keywords: ["speed", "slow"] },
    { value: "security", label: "security", keywords: ["vulnerability"] },
    { value: "refactor", label: "refactor", keywords: ["cleanup"] },
  ]
}

export { Example }
