import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
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
    ComboboxLabel,
    ComboboxList,
    ComboboxTrigger,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div data-slot="stack">
      @for (variant of variants; track variant) {
        <ng-container
          uiCombobox
          [defaultValue]="variant === 'item' ? null : 'fr'"
          [itemToLabel]="countryLabel"
          [disabled]="variant === 'disabled'"
          [readOnly]="variant === 'readOnly'"
        >
          <div data-slot="stack">
            <label uiComboboxLabel>
              {{
                variant === "disabled"
                  ? "Billing country"
                  : variant === "readOnly"
                    ? "Shipping from"
                    : "Shipping to"
              }}
            </label>
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
                  [disabled]="country.value === 'dk'"
                >
                  {{ country.label }}
                  <span *uiComboboxItemIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </div>
              }
            </div>
          </div>
        </ng-container>
      }
    </div>
  `,
})
class Example {
  readonly countries = [
    { value: "ar", label: "Argentina" },
    { value: "au", label: "Australia" },
    { value: "at", label: "Austria" },
    { value: "be", label: "Belgium" },
    { value: "br", label: "Brazil" },
    { value: "ca", label: "Canada" },
    { value: "cl", label: "Chile" },
    { value: "dk", label: "Denmark" },
    { value: "fi", label: "Finland" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "gr", label: "Greece" },
    { value: "jp", label: "Japan" },
    { value: "nl", label: "Netherlands" },
    { value: "es", label: "Spain" },
    { value: "se", label: "Sweden" },
    { value: "ch", label: "Switzerland" },
  ]

  readonly countryLabel = (value: string) =>
    this.countries.find((country) => country.value === value)?.label ?? value

  readonly variants = ["disabled", "readOnly", "item"] as const
}

export { Example }
