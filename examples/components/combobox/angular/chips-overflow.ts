import { Component } from "@angular/core"
import { LucideCheck, LucideX } from "@lucide/angular"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxChipsOverflow,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
} from "@ui-sdk/angular/combobox"

@Component({
  imports: [
    Combobox,
    ComboboxChip,
    ComboboxChipRemove,
    ComboboxChips,
    ComboboxChipsOverflow,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxList,
    ComboboxValue,
    LucideCheck,
    LucideX,
  ],
  template: `
    <ng-container
      uiCombobox
      multiple
      [defaultValue]="['fr', 'jp', 'se', 'de', 'ch']"
      [itemToLabel]="countryLabel"
    >
      <div data-slot="stack">
        <label uiComboboxLabel>Countries</label>
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
          <span
            uiComboboxChipsOverflow
            #comboboxChipsOverflow="uiComboboxChipsOverflow"
            [title]="comboboxChipsOverflow.state().labels.join(', ')"
            data-slot="hint"
          >
            +{{ comboboxChipsOverflow.state().count }}
          </span>
          <input uiComboboxInput placeholder="Add…" />
        </div>
        <p data-slot="hint">
          <span
            uiComboboxValue
            [maxLabels]="2"
            [getMoreLabel]="getMoreLabel"
          ></span>
        </p>
      </div>
      <div *uiComboboxContent>
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

  readonly countryLabel = (value: string) =>
    this.countries.find((country) => country.value === value)?.label ?? value

  itemsOf(items: unknown) {
    return items as string[]
  }

  readonly getMoreLabel = (count: number) => `${count} more`
}

export { Example }
