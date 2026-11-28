import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideMinus } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectSelectAll,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectValueProps,
} from "@ui-sdk/angular/select"

@Component({
  imports: [
    Field,
    FieldLabel,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectSelectAll,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
    LucideMinus,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Regions</label>
      <ng-container
        uiSelect
        multiple
        [defaultValue]="['us-east', 'europe', 'asia-pacific']"
        placeholder="Select regions"
      >
        <button uiSelectTrigger>
          <span
            uiSelectValue
            [maxLabels]="2"
            [getMoreLabel]="getMoreLabel"
          ></span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          <div uiSelectSelectAll #selectSelectAll="uiSelectSelectAll">
            Select all
            @if (selectSelectAll.state().checked) {
              <svg lucideCheck></svg>
            }
            @if (selectSelectAll.state().indeterminate) {
              <svg lucideMinus></svg>
            }
          </div>
          <div uiSelectSeparator></div>
          @for (region of regions; track region.value) {
            <div uiSelectItem [value]="region.value">
              {{ region.label }}
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
  readonly regions = [
    { value: "us-east", label: "US East" },
    { value: "us-west", label: "US West" },
    { value: "europe", label: "Europe" },
    { value: "asia-pacific", label: "Asia Pacific" },
    { value: "south-america", label: "South America" },
  ]

  readonly getMoreLabel: SelectValueProps["getMoreLabel"] = (count) =>
    `${count} more`
}

export { Example }
