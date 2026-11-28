import { Component } from "@angular/core"
import {
  LucideCheck,
  LucideChevronDown,
  LucideTextAlignCenter,
  LucideTextAlignEnd,
  LucideTextAlignStart,
} from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIcon,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
  SelectValueIcon,
} from "@ui-sdk/angular/select"

@Component({
  imports: [
    Field,
    FieldLabel,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIcon,
    SelectItemIndicator,
    SelectTrigger,
    SelectValue,
    SelectValueIcon,
    LucideCheck,
    LucideChevronDown,
    LucideTextAlignCenter,
    LucideTextAlignEnd,
    LucideTextAlignStart,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Text alignment</label>
      <ng-container uiSelect defaultValue="start">
        <button uiSelectTrigger>
          <span uiSelectValueIcon></span>
          <span uiSelectValue></span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          <div uiSelectItem value="start">
            <span uiSelectItemIcon mirror>
              <svg lucideTextAlignStart></svg>
            </span>
            Start
            <span *uiSelectItemIndicator>
              <svg lucideCheck></svg>
            </span>
          </div>
          <div uiSelectItem value="center">
            <span uiSelectItemIcon>
              <svg lucideTextAlignCenter></svg>
            </span>
            Center
            <span *uiSelectItemIndicator>
              <svg lucideCheck></svg>
            </span>
          </div>
          <div uiSelectItem value="end">
            <span uiSelectItemIcon mirror>
              <svg lucideTextAlignEnd></svg>
            </span>
            End
            <span *uiSelectItemIndicator>
              <svg lucideCheck></svg>
            </span>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
