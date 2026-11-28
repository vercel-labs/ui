import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { DateInput } from "@ui-sdk/angular/date-input"
import { Field, FieldLabel } from "@ui-sdk/angular/field"

@Component({
  imports: [DateInput, Field, FieldLabel],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="value.set(null)">Clear</button>
      </div>
      <div uiField>
        <label uiFieldLabel>Due date</label>
        <div
          uiDateInput
          [(value)]="value"
          (beforeValueChange)="log('Due date ' + ($event.value ?? 'empty'))"
        ></div>
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly value = signal<string | null>("2026-11-02")
}

export { Example }
