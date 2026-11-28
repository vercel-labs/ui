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
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from "@ui-sdk/angular/combobox"

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
    ComboboxLabel,
    ComboboxList,
    ComboboxSeparator,
    ComboboxTrigger,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <ng-container uiCombobox>
      <div data-slot="stack">
        <label uiComboboxLabel>Timezone</label>
        <div data-slot="row">
          <input uiComboboxInput placeholder="Search cities…" />
          <button uiComboboxTrigger aria-label="Show timezones">
            <svg lucideChevronDown></svg>
          </button>
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxEmpty>No cities found.</div>
        <div uiComboboxList>
          @for (group of timezones; track group.label; let index = $index) {
            @if (index > 0) {
              <div uiComboboxSeparator></div>
            }
            <div uiComboboxGroup>
              <div uiComboboxGroupLabel>
                {{ group.label }}
              </div>
              @for (item of group.items; track item.value) {
                <div uiComboboxItem [value]="item.value" [label]="item.label">
                  {{ item.label }}
                  <span *uiComboboxItemIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly timezones = [
    {
      label: "Americas",
      items: [
        { value: "America/New_York", label: "New York" },
        { value: "America/Chicago", label: "Chicago" },
        { value: "America/Denver", label: "Denver" },
        { value: "America/Los_Angeles", label: "Los Angeles" },
        { value: "America/Sao_Paulo", label: "São Paulo" },
      ],
    },
    {
      label: "Europe",
      items: [
        { value: "Europe/London", label: "London" },
        { value: "Europe/Paris", label: "Paris" },
        { value: "Europe/Berlin", label: "Berlin" },
        { value: "Europe/Madrid", label: "Madrid" },
      ],
    },
    {
      label: "Asia & Pacific",
      items: [
        { value: "Asia/Tokyo", label: "Tokyo" },
        { value: "Asia/Singapore", label: "Singapore" },
        { value: "Asia/Kolkata", label: "Kolkata" },
        { value: "Australia/Sydney", label: "Sydney" },
      ],
    },
  ]
}

export { Example }
