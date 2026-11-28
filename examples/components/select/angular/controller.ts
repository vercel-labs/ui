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
  createSelectController,
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
      <div data-slot="controls">
        <button type="button" (click)="openAndWait()">Open and Wait</button>
        <button type="button" (click)="status.setValue('done')">
          Mark Done
        </button>
        <button type="button" (click)="status.clear()">Clear</button>
        <button type="button" (click)="status.focus()">Focus</button>
      </div>
      <div uiField>
        <label uiFieldLabel>Status</label>
        <button uiSelectTrigger [controller]="status">
          <span uiSelectValue></span>
          <svg lucideChevronDown></svg>
        </button>
      </div>
      <ng-container
        uiSelect
        [controller]="status"
        [items]="statuses"
        placeholder="Select a status"
      >
        <div *uiSelectContent>
          @for (item of statuses; track item.value) {
            <div uiSelectItem [value]="item.value">
              {{ item.label }}
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
  readonly statuses = [
    { value: "backlog", label: "Backlog" },
    { value: "todo", label: "Todo" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ]

  readonly status = createSelectController<string>()

  readonly log = useLog()

  async openAndWait() {
    const { reason } = await this.status.open()
    this.log(`Closed by ${reason}, with ${this.status.getValue() ?? "nothing"}`)
  }
}

export { Example }
