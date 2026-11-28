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
  SelectTrigger,
  SelectValue,
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
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Time zone</label>
      <ng-container uiSelect placeholder="Select a time zone">
        <button uiSelectTrigger>
          <span uiSelectValue></span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          @for (group of timezones; track group.label) {
            <div uiSelectGroup>
              <div uiSelectGroupLabel>{{ group.label }}</div>
              @for (item of group.items; track item.value) {
                <div uiSelectItem [value]="item.value">
                  {{ item.label }}
                  <span *uiSelectItemIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </div>
              }
            </div>
          }
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly timezones = [
    {
      label: "North America",
      items: [
        { value: "est", label: "Eastern Standard Time" },
        { value: "cst", label: "Central Standard Time" },
        { value: "mst", label: "Mountain Standard Time" },
        { value: "pst", label: "Pacific Standard Time" },
        { value: "akst", label: "Alaska Standard Time" },
        { value: "hst", label: "Hawaii Standard Time" },
      ],
    },
    {
      label: "Europe & Africa",
      items: [
        { value: "gmt", label: "Greenwich Mean Time" },
        { value: "cet", label: "Central European Time" },
        { value: "eet", label: "Eastern European Time" },
        { value: "west", label: "Western European Summer Time" },
        { value: "cat", label: "Central Africa Time" },
        { value: "eat", label: "East Africa Time" },
      ],
    },
    {
      label: "Asia",
      items: [
        { value: "msk", label: "Moscow Time" },
        { value: "ist", label: "India Standard Time" },
        { value: "cst-china", label: "China Standard Time" },
        { value: "jst", label: "Japan Standard Time" },
        { value: "kst", label: "Korea Standard Time" },
        { value: "ist-indonesia", label: "Indonesia Central Standard Time" },
      ],
    },
    {
      label: "Australia & Pacific",
      items: [
        { value: "awst", label: "Australian Western Standard Time" },
        { value: "acst", label: "Australian Central Standard Time" },
        { value: "aest", label: "Australian Eastern Standard Time" },
        { value: "nzst", label: "New Zealand Standard Time" },
        { value: "fjt", label: "Fiji Time" },
      ],
    },
  ]
}

export { Example }
