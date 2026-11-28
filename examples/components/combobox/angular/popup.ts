import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideSearch } from "@lucide/angular"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@ui-sdk/angular/combobox"

@Component({
  imports: [
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
    LucideCheck,
    LucideChevronDown,
    LucideSearch,
  ],
  template: `
    <ng-container
      uiCombobox
      [(query)]="query"
      defaultValue="jp"
      [itemToLabel]="countryLabel"
      (beforeOpenChange)="$event.value && query.set('')"
      (openChangeComplete)="!$event && button?.focus()"
    >
      <button uiComboboxTrigger aria-label="Country" #button>
        <span>
          <span uiComboboxValue #comboboxValue="uiComboboxValue">
            {{ comboboxValue.state().label || "Select a country" }}
          </span>
        </span>
        <svg lucideChevronDown></svg>
      </button>
      <div *uiComboboxContent="{ anchor: button }">
        <div data-slot="row">
          <svg lucideSearch></svg>
          <input
            uiComboboxInput
            autofocus
            aria-label="Search countries"
            placeholder="Search…"
          />
        </div>
        <div uiComboboxEmpty>No countries found.</div>
        <div uiComboboxList>
          @for (country of countries; track country.value) {
            <div uiComboboxItem [value]="country.value" [label]="country.label">
              {{ country.label }}
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

  readonly query = signal("")
}

export { Example }
