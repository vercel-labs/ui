import { Component } from "@angular/core"
import { LucideCheck, LucideMinus, LucideX } from "@lucide/angular"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxSelectAll,
  ComboboxValue,
} from "@ui-sdk/angular/combobox"

@Component({
  imports: [
    Combobox,
    ComboboxChip,
    ComboboxChipRemove,
    ComboboxChips,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxGroupLabel,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxList,
    ComboboxSelectAll,
    ComboboxValue,
    LucideCheck,
    LucideMinus,
    LucideX,
  ],
  template: `
    <ng-container uiCombobox multiple [defaultValue]="['Europe/Paris']">
      <div data-slot="stack">
        <label uiComboboxLabel>Timezones</label>
        <div uiComboboxChips>
          <span uiComboboxValue #comboboxValue="uiComboboxValue">
            @for (
              value of itemsOf(comboboxValue.state().value);
              track value;
              let index = $index
            ) {
              <div uiComboboxChip [value]="value">
                {{ comboboxValue.state().labels[index] }}
                <button
                  uiComboboxChipRemove
                  [attr.aria-label]="\`Remove \${comboboxValue.state().labels[index]}\`"
                >
                  <svg lucideX></svg>
                </button>
              </div>
            }
          </span>
          <input uiComboboxInput placeholder="Add timezones…" />
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxEmpty>No timezones found.</div>
        <div uiComboboxList>
          <div uiComboboxSelectAll>
            <span>
              <svg lucideCheck></svg>
              <svg lucideMinus></svg>
            </span>
            Select all
          </div>
          @for (group of timezones; track group.label) {
            <div uiComboboxGroup>
              <div uiComboboxGroupLabel>
                {{ group.label }}
              </div>
              <div uiComboboxSelectAll #comboboxSelectAll="uiComboboxSelectAll">
                {{
                  comboboxSelectAll.state().checked
                    ? "Clear " + group.label
                    : "Select all in " + group.label
                }}
              </div>
              @for (zone of group.items; track zone.value) {
                <div uiComboboxItem [value]="zone.value" [label]="zone.label">
                  <span>
                    <span *uiComboboxItemIndicator>
                      <svg lucideCheck></svg>
                    </span>
                  </span>
                  {{ zone.label }}
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

  itemsOf(items: unknown) {
    return items as string[]
  }
}

export { Example }
