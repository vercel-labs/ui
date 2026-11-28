import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"
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
    Checkbox,
    CheckboxIndicator,
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
      <div data-slot="controls">
        <label data-slot="label">
          <button
            uiCheckbox
            [checked]="aligned()"
            (beforeCheckedChange)="aligned.set($event.value === true)"
          >
            <span uiCheckboxIndicator>
              <svg lucideCheck></svg>
            </span>
          </button>
          Align item with trigger
        </label>
      </div>
      <div uiField>
        <label uiFieldLabel>Priority</label>
        <ng-container uiSelect defaultValue="medium">
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent="{ alignItemWithTrigger: aligned() }">
            @for (priority of priorities; track priority.value) {
              <div uiSelectItem [value]="priority.value">
                {{ priority.label }}
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
  readonly priorities = [
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
    { value: "none", label: "No priority" },
  ]

  readonly aligned = signal(true)
}

export { Example }
