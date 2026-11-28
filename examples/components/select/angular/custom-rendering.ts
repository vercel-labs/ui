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
    <div uiField>
      <label uiFieldLabel>Reviewer</label>
      <ng-container uiSelect defaultValue="hollis">
        <button uiSelectTrigger>
          <span uiSelectValue #selectValue="uiSelectValue">
            <span data-slot="badge">{{
              selectValue.state().label.slice(0, 1)
            }}</span>
            {{ selectValue.state().label }}
          </span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          @for (member of members; track member.value) {
            <div
              uiSelectItem
              #selectItem="uiSelectItem"
              [value]="member.value"
              [label]="member.name"
              [disabled]="member.value === 'wren'"
            >
              <span data-slot="badge">{{ member.name.slice(0, 1) }}</span>
              <span data-slot="stack">
                {{ member.name }}
                <span data-slot="hint">{{
                  selectItem.state().disabled ? "Out of office" : member.email
                }}</span>
              </span>
              <span *uiSelectItemIndicator="let indicator">
                @if (indicator.selected) {
                  <svg lucideCheck></svg>
                }
              </span>
            </div>
          }
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly members = [
    { value: "hollis", name: "Hollis Grant", email: "hollis@example.com" },
    { value: "ines", name: "Inès Moreau", email: "ines@example.com" },
    { value: "kofi", name: "Kofi Mensah", email: "kofi@example.com" },
    { value: "wren", name: "Wren Takahashi", email: "wren@example.com" },
  ]
}

export { Example }
