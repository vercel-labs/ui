import { Component, signal } from "@angular/core"
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
        <button type="button" (click)="value.set('jp')">Choose Japan</button>
        <button type="button" (click)="open.set(true)">Open</button>
      </div>
      <ng-container
        uiCombobox
        [(value)]="value"
        [(query)]="query"
        [(open)]="open"
        [itemToLabel]="countryLabel"
        debug
        (beforeValueChange)="
          log('value: ' + $event.value + ' (' + $event.reason + ')')
        "
        (beforeQueryChange)="
          log('query: “' + $event.value + '” (' + $event.reason + ')')
        "
        (beforeOpenChange)="
          log('open: ' + $event.value + ' (' + $event.reason + ')')
        "
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
            @for (country of countries; track country.value) {
              <div
                uiComboboxItem
                [value]="country.value"
                [label]="country.label"
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

  readonly value = signal<string | null>("fr")

  readonly query = signal("France")

  readonly open = signal(false)

  readonly log = useLog()
}

export { Example }
