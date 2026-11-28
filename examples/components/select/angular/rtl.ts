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
    <div dir="rtl">
      <div uiField>
        <label uiFieldLabel>اللغة</label>
        <ng-container uiSelect placeholder="اختر لغة">
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (language of languages; track language.value) {
              <div uiSelectItem [value]="language.value">
                {{ language.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
class Example {
  readonly languages = [
    { value: "ar", label: "العربية" },
    { value: "en", label: "الإنجليزية" },
    { value: "fr", label: "الفرنسية" },
    { value: "es", label: "الإسبانية" },
    { value: "de", label: "الألمانية" },
  ]
}

export { Example }
