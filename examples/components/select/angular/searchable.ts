import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectList,
  SelectTrigger,
  SelectValue,
  type SelectOptions,
} from "@ui-sdk/angular/select"

const countries = [
  { value: "ar", label: "Argentina", code: "+54" },
  { value: "au", label: "Australia", code: "+61" },
  { value: "at", label: "Austria", code: "+43" },
  { value: "be", label: "Belgium", code: "+32" },
  { value: "br", label: "Brazil", code: "+55" },
  { value: "ca", label: "Canada", code: "+1" },
  { value: "cl", label: "Chile", code: "+56" },
  { value: "cn", label: "China", code: "+86" },
  { value: "dk", label: "Denmark", code: "+45" },
  { value: "fi", label: "Finland", code: "+358" },
  { value: "fr", label: "France", code: "+33" },
  { value: "de", label: "Germany", code: "+49" },
  { value: "gr", label: "Greece", code: "+30" },
  { value: "in", label: "India", code: "+91" },
  { value: "ie", label: "Ireland", code: "+353" },
  { value: "it", label: "Italy", code: "+39" },
  { value: "jp", label: "Japan", code: "+81" },
  { value: "mx", label: "Mexico", code: "+52" },
  { value: "nl", label: "Netherlands", code: "+31" },
  { value: "no", label: "Norway", code: "+47" },
  { value: "pt", label: "Portugal", code: "+351" },
  { value: "es", label: "Spain", code: "+34" },
  { value: "se", label: "Sweden", code: "+46" },
  { value: "ch", label: "Switzerland", code: "+41" },
]

const popularCountries = [
  {
    type: "group" as const,
    label: "Popular",
    items: [countries[5], countries[11], countries[16]],
  },
]

@Component({
  imports: [
    Field,
    FieldLabel,
    Select,
    SelectContent,
    SelectEmpty,
    SelectGroup,
    SelectGroupLabel,
    SelectInput,
    SelectItem,
    SelectItemIndicator,
    SelectItemText,
    SelectList,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Country</label>
      <ng-container
        uiSelect
        [items]="countries"
        [emptyItems]="popularCountries"
        placeholder="Select a country"
        filter="contains"
        [announcement]="announcement"
      >
        <button uiSelectTrigger>
          <span uiSelectValue></span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          <input
            uiSelectInput
            aria-label="Search countries"
            placeholder="Search countries…"
          />
          <div uiSelectEmpty>No countries found.</div>
          <div uiSelectList #selectList="uiSelectList">
            @for (
              entry of itemsOf(selectList.state().items);
              track "items" in entry ? entry.label : entry.value
            ) {
              @if ("items" in entry) {
                <div uiSelectGroup>
                  <div uiSelectGroupLabel>{{ entry.label }}</div>
                  @for (country of entry.items; track country.value) {
                    <div
                      uiSelectItem
                      [value]="country.value"
                      [label]="country.label"
                    >
                      <span uiSelectItemText></span>
                      <span *uiSelectItemIndicator>
                        <svg lucideCheck></svg>
                      </span>
                    </div>
                  }
                </div>
              } @else {
                <div uiSelectItem [value]="entry.value" [label]="entry.label">
                  <span uiSelectItemText></span>
                  <span *uiSelectItemIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </div>
              }
            }
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly countries = countries

  readonly popularCountries = popularCountries

  itemsOf(items: unknown) {
    return items as (
      (typeof countries)[number] | (typeof popularCountries)[number]
    )[]
  }

  readonly announcement: SelectOptions["announcement"] = (change) =>
    change.type === "results"
      ? `${change.count} ${change.count === 1 ? "country" : "countries"} found`
      : null
}

export { Example }
