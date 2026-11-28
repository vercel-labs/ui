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
  type SelectValueChange,
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
        <button type="button" (click)="value.set('editor')">Make Editor</button>
        <button type="button" (click)="open.set(true)">Open</button>
      </div>
      <div uiField>
        <label uiFieldLabel>Role</label>
        <ng-container
          uiSelect
          [(value)]="value"
          (beforeValueChange)="onValueChange($event)"
          [(open)]="open"
          (beforeOpenChange)="
            log('open: ' + $event.value + ' (' + $event.reason + ')')
          "
        >
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (role of roles; track role.value) {
              <div uiSelectItem [value]="role.value">
                {{ role.label }}
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
  readonly roles = [
    { value: "viewer", label: "Viewer" },
    { value: "commenter", label: "Commenter" },
    { value: "editor", label: "Editor" },
    { value: "admin", label: "Admin" },
    { value: "owner", label: "Owner" },
  ]

  readonly value = signal<string | null>("viewer")

  readonly open = signal(false)

  readonly log = useLog()

  onValueChange(change: SelectValueChange) {
    if (change.value === "owner") {
      change.cancel()
      this.log("Only the owner can transfer ownership")
      return
    }
    this.log(`value: ${change.value} (${change.reason})`)
  }
}

export { Example }
