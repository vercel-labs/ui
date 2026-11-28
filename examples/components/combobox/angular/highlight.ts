import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
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
    ComboboxItemText,
    ComboboxLabel,
    ComboboxList,
    ComboboxTrigger,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <ng-container uiCombobox>
      <div data-slot="stack">
        <label uiComboboxLabel>Country</label>
        <div data-slot="row">
          <input uiComboboxInput placeholder="Search countries…" />
          <button uiComboboxTrigger aria-label="Show countries">
            <svg lucideChevronDown></svg>
          </button>
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxEmpty>No countries found.</div>
        <div uiComboboxList>
          @for (country of countries; track country.value) {
            <div
              uiComboboxItem
              [value]="country.value"
              [label]="country.label"
              [keywords]="country.keywords"
            >
              <span uiComboboxItemText #comboboxItemText="uiComboboxItemText">
                @for (
                  segment of comboboxItemText.state().segments;
                  track index;
                  let index = $index
                ) {
                  @if (segment.match) {
                    <mark>{{ segment.text }}</mark>
                  } @else {
                    <span>{{ segment.text }}</span>
                  }
                }
              </span>
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
  readonly countries = [
    { value: "ar", label: "Argentina", keywords: ["república argentina"] },
    { value: "au", label: "Australia", keywords: ["oz"] },
    { value: "at", label: "Austria", keywords: ["österreich"] },
    { value: "be", label: "Belgium", keywords: ["belgië", "belgique"] },
    { value: "br", label: "Brazil", keywords: ["brasil"] },
    { value: "ca", label: "Canada" },
    { value: "cl", label: "Chile" },
    { value: "dk", label: "Denmark", keywords: ["danmark"] },
    { value: "fi", label: "Finland", keywords: ["suomi"] },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany", keywords: ["deutschland"] },
    { value: "gr", label: "Greece", keywords: ["hellas", "ελλάδα"] },
    { value: "jp", label: "Japan", keywords: ["nippon", "日本"] },
    { value: "nl", label: "Netherlands", keywords: ["holland", "nederland"] },
    { value: "es", label: "Spain", keywords: ["españa"] },
    { value: "se", label: "Sweden", keywords: ["sverige"] },
    {
      value: "ch",
      label: "Switzerland",
      keywords: ["schweiz", "suisse", "svizzera"],
    },
  ]
}

export { Example }
