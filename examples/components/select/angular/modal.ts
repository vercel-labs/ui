import { Component, signal } from "@angular/core"
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
      <div data-slot="controls" role="group" aria-label="Modal">
        @for (mode of modes; track mode.label) {
          <button
            type="button"
            [attr.aria-pressed]="modal() === mode.value"
            (click)="modal.set(mode.value)"
          >
            {{ mode.label }}
          </button>
        }
      </div>
      <div uiField>
        <label uiFieldLabel>Status</label>
        <ng-container uiSelect [modal]="modal()" defaultValue="todo">
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (status of statuses; track status.value) {
              <div uiSelectItem [value]="status.value">
                {{ status.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
      <button type="button" (click)="log('Pressed Save Draft')">
        Save Draft
      </button>
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

  readonly modes = [
    { value: "pointer", label: "Pointer" },
    { value: true, label: "Modal" },
    { value: false, label: "Non-modal" },
  ] as const

  readonly modal = signal<boolean | "pointer">("pointer")

  readonly log = useLog()
}

export { Example }
