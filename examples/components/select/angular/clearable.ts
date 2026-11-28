import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideX } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectClear,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
  type SelectValueChange,
} from "@ui-sdk/angular/select"

@Component({
  imports: [
    Field,
    FieldLabel,
    Select,
    SelectClear,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
    LucideX,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Assignee</label>
      <ng-container
        uiSelect
        defaultValue="ines"
        placeholder="Unassigned"
        (beforeValueChange)="onValueChange($event)"
      >
        <div data-slot="row">
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <button *uiSelectClear aria-label="Clear assignee">
            <svg lucideX></svg>
          </button>
        </div>
        <div *uiSelectContent>
          @for (person of people; track person.value) {
            <div uiSelectItem [value]="person.value">
              {{ person.label }}
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
  readonly people = [
    { value: "hollis", label: "Hollis Grant" },
    { value: "ines", label: "Inès Moreau" },
    { value: "kofi", label: "Kofi Mensah" },
    { value: "wren", label: "Wren Takahashi" },
    { value: "tomasz", label: "Tomasz Wójcik" },
  ]

  readonly log = useLog()

  onValueChange(change: SelectValueChange) {
    this.log(`value: ${JSON.stringify(change.value)} (${change.reason})`)
  }
}

export { Example }
