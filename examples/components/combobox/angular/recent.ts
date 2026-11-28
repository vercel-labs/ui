import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/angular/combobox"
import { type ListAnnouncement } from "@ui-sdk/core/combobox"

const countries = [
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

const recentCountries = [
  {
    type: "group" as const,
    label: "Recent",
    items: [countries[9], countries[12], countries[15]],
  },
]

@Component({
  imports: [
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxGroupLabel,
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
    <ng-container
      uiCombobox
      [items]="countries"
      [emptyItems]="recentCountries"
      [announcement]="announcement"
    >
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
        <div uiComboboxList #comboboxList="uiComboboxList">
          @for (
            entry of itemsOf(comboboxList.state().items);
            track "items" in entry ? entry.label : entry.value
          ) {
            @if ("items" in entry) {
              <div uiComboboxGroup>
                <div uiComboboxGroupLabel>{{ entry.label }}</div>
                @for (country of entry.items; track country.value) {
                  <div
                    uiComboboxItem
                    [value]="country.value"
                    [label]="country.label"
                  >
                    <span uiComboboxItemText></span>
                    <span *uiComboboxItemIndicator>
                      <svg lucideCheck></svg>
                    </span>
                  </div>
                }
              </div>
            } @else {
              <div uiComboboxItem [value]="entry.value" [label]="entry.label">
                <span uiComboboxItemText></span>
                <span *uiComboboxItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly countries = countries

  readonly recentCountries = recentCountries

  readonly announcement = (change: ListAnnouncement) =>
    change.type === "results" ? `${change.count} countries match` : null

  itemsOf(items: unknown) {
    return items as (
      (typeof countries)[number] | (typeof recentCountries)[number]
    )[]
  }
}

export { Example }
