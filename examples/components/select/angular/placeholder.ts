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
      <div uiField>
        <label uiFieldLabel>Size</label>
        <ng-container uiSelect placeholder="Select a size">
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (size of sizes; track size) {
              <div uiSelectItem [value]="size">
                {{ size }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
      <div uiField>
        <label uiFieldLabel>Gift wrap</label>
        <ng-container uiSelect>
          <button uiSelectTrigger>
            <span uiSelectValue placeholder="None"></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (wrap of wraps; track wrap) {
              <div uiSelectItem [value]="wrap">
                {{ wrap }}
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
  readonly sizes = ["Extra small", "Small", "Medium", "Large", "Extra large"]

  readonly wraps = ["Paper", "Ribbon", "Box"]
}

export { Example }
