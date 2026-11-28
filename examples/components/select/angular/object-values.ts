import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
  type SelectOptions,
} from "@ui-sdk/angular/select"

type Member = { id: number; name: string; email: string }

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
      <label uiFieldLabel>Assignee</label>
      <ng-container
        uiSelect
        [defaultValue]="{ ...members[1] }"
        (beforeValueChange)="
          log('Submits assignee=' + ($event.value ? $event.value.id : ''))
        "
        name="assignee"
        [itemToValue]="itemToValue"
        [itemToLabel]="itemToLabel"
        [isItemEqualToValue]="isItemEqualToValue"
        placeholder="Unassigned"
      >
        <button uiSelectTrigger>
          <span uiSelectValue></span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          @for (member of members; track member.id) {
            <div uiSelectItem [value]="member">
              <span data-slot="stack">
                {{ member.name }}
                <span data-slot="hint">{{ member.email }}</span>
              </span>
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
  readonly members: Member[] = [
    { id: 1, name: "Hollis Grant", email: "hollis@example.com" },
    { id: 2, name: "Inès Moreau", email: "ines@example.com" },
    { id: 3, name: "Kofi Mensah", email: "kofi@example.com" },
    { id: 4, name: "Wren Takahashi", email: "wren@example.com" },
  ]

  readonly log = useLog()

  readonly itemToValue: SelectOptions<Member>["itemToValue"] = (member) =>
    String(member.id)

  readonly itemToLabel: SelectOptions<Member>["itemToLabel"] = (member) =>
    member.name

  readonly isItemEqualToValue: SelectOptions<Member>["isItemEqualToValue"] = (
    item,
    value
  ) => item.id === value.id
}

export { Example }
