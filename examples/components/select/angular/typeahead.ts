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
    <div uiField>
      <label uiFieldLabel>Country</label>
      <ng-container uiSelect defaultValue="fr">
        <button uiSelectTrigger>
          <span uiSelectValue></span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          @for (country of countries; track country.value) {
            <div uiSelectItem [value]="country.value" [label]="country.label">
              {{ country.label }}
              <span data-slot="hint">{{ country.code }}</span>
              <span *uiSelectItemIndicator>
                <svg lucideCheck></svg>
              </span>
            </div>
          }
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly countries = [
    { value: "ar", label: "Argentina", code: "+54" },
    { value: "au", label: "Australia", code: "+61" },
    { value: "at", label: "Austria", code: "+43" },
    { value: "be", label: "Belgium", code: "+32" },
    { value: "br", label: "Brazil", code: "+55" },
    { value: "ca", label: "Canada", code: "+1" },
    { value: "dk", label: "Denmark", code: "+45" },
    { value: "fr", label: "France", code: "+33" },
    { value: "de", label: "Germany", code: "+49" },
    { value: "gr", label: "Greece", code: "+30" },
    { value: "ie", label: "Ireland", code: "+353" },
    { value: "jp", label: "Japan", code: "+81" },
    { value: "es", label: "Spain", code: "+34" },
    { value: "se", label: "Sweden", code: "+46" },
    { value: "ch", label: "Switzerland", code: "+41" },
  ]
}

export { Example }
