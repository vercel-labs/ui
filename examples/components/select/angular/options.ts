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
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Size</label>
      <ng-container
        uiSelect
        [items]="sizeGroups"
        name="size"
        defaultValue="Medium"
      >
        <button uiSelectTrigger>
          <span uiSelectValue></span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          @for (group of sizeGroups; track group.label) {
            <div uiSelectGroup>
              <div uiSelectGroupLabel>{{ group.label }}</div>
              @for (size of group.items; track size) {
                <div uiSelectItem [value]="size">
                  {{ size }}
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
  readonly sizeGroups = [
    { type: "group", label: "Common", items: ["Small", "Medium", "Large"] },
    { type: "group", label: "Extended", items: ["Extra small", "Extra large"] },
  ] satisfies ListData
}

export { Example }
