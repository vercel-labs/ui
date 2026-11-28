import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
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
  createComboboxController,
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
      <div data-slot="controls">
        <button type="button" (click)="openAndWait()">Open and Wait</button>
        <button type="button" (click)="search()">Search “sw”</button>
        <button type="button" (click)="country.setValue('de')">
          Choose Germany
        </button>
        <button type="button" (click)="country.clear()">Clear</button>
      </div>
      <ng-container
        uiCombobox
        [controller]="country"
        [itemToLabel]="countryLabel"
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
          <div uiComboboxList>
            @for (item of countries; track item.value) {
              <div uiComboboxItem [value]="item.value" [label]="item.label">
                {{ item.label }}
                <span *uiComboboxItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </div>
      </ng-container>
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

  readonly country = createComboboxController<string>()

  readonly log = useLog()

  async openAndWait() {
    const { reason } = await this.country.open()
    this.log(
      `Closed by ${reason}, with ${this.country.getValue() ?? "nothing"}`
    )
  }

  search() {
    this.country.focus()
    this.country.setQuery("sw")
    this.country.open()
  }
}

export { Example }
