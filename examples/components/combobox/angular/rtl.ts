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
    <div dir="rtl">
      <ng-container uiCombobox>
        <div data-slot="stack">
          <label uiComboboxLabel>المدينة</label>
          <div data-slot="row">
            <input uiComboboxInput placeholder="ابحث عن مدينة…" />
            <button uiComboboxTrigger aria-label="عرض المدن">
              <svg lucideChevronDown></svg>
            </button>
          </div>
        </div>
        <div *uiComboboxContent>
          <div uiComboboxEmpty>لا توجد نتائج.</div>
          <div uiComboboxList>
            @for (city of cities; track city.value) {
              <div uiComboboxItem [value]="city.value" [label]="city.label">
                {{ city.label }}
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
  readonly cities = [
    { value: "cairo", label: "القاهرة" },
    { value: "dubai", label: "دبي" },
    { value: "riyadh", label: "الرياض" },
    { value: "beirut", label: "بيروت" },
    { value: "amman", label: "عمّان" },
    { value: "rabat", label: "الرباط" },
  ]
}

export { Example }
