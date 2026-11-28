import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemIndicator,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type ListData,
} from "@ui-sdk/angular/select"

@Component({
  imports: [
    Field,
    FieldLabel,
    Select,
    SelectContent,
    SelectGroup,
    SelectGroupLabel,
    SelectItem,
    SelectItemIndicator,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Plan</label>
      <ng-container uiSelect [items]="items" defaultValue="pro">
        <button uiSelectTrigger>
          <span uiSelectValue></span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          @for (plan of plans; track plan.value) {
            <div uiSelectItem [value]="plan.value">
              {{ plan.label }}
              <span *uiSelectItemIndicator>
                <svg lucideCheck></svg>
              </span>
            </div>
          }
          <div uiSelectSeparator></div>
          <div uiSelectGroup>
            <div uiSelectGroupLabel>Contact sales</div>
            @for (plan of sales; track plan.value) {
              <div uiSelectItem [value]="plan.value" [disabled]="plan.disabled">
                {{ plan.label }}
                <span *uiSelectItemIndicator>
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
  readonly plans = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
    { value: "team", label: "Team" },
  ]

  readonly sales = [
    { value: "enterprise", label: "Enterprise" },
    { value: "education", label: "Education", disabled: true },
  ]

  readonly items: ListData = [
    ...this.plans,
    { type: "separator" },
    { type: "group", label: "Contact sales", items: this.sales },
  ]
}

export { Example }
