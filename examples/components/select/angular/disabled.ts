import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"

@Component({
  imports: [
    Field,
    FieldLabel,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div data-slot="stack">
      @for (field of fields; track field.label) {
        <div uiField>
          <label uiFieldLabel>{{ field.label }}</label>
          <ng-container
            uiSelect
            [defaultValue]="field.disabled || field.readOnly ? 'fr' : null"
            placeholder="Select a country"
            [disabled]="field.disabled"
            [readOnly]="field.readOnly"
          >
            <button uiSelectTrigger>
              <span uiSelectValue></span>
              <svg lucideChevronDown></svg>
            </button>
            <div *uiSelectContent>
              @for (country of countries; track country.value) {
                <div
                  uiSelectItem
                  [value]="country.value"
                  [disabled]="country.value === 'dk'"
                >
                  {{ country.label }}
                  <span *uiSelectItemIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </div>
              }
            </div>
          </ng-container>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly countries = [
    { value: "ca", label: "Canada" },
    { value: "dk", label: "Denmark" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "jp", label: "Japan" },
    { value: "es", label: "Spain" },
  ]

  readonly fields = [
    { label: "Billing country", disabled: true },
    { label: "Shipping from", readOnly: true },
    { label: "Shipping to" },
  ]
}

export { Example }
