import { Component } from "@angular/core"
import {
  createDateInputController,
  DateInput,
} from "@ui-sdk/angular/date-input"
import { Field, FieldLabel } from "@ui-sdk/angular/field"

@Component({
  imports: [DateInput, Field, FieldLabel],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="publish.setValue('2026-12-25')">
          Christmas
        </button>
        <button type="button" (click)="publish.focus('year')">Edit Year</button>
        <button type="button" (click)="publish.clear()">Clear</button>
      </div>
      <div uiField>
        <label uiFieldLabel>Publish on</label>
        <div uiDateInput [controller]="publish"></div>
      </div>
    </div>
  `,
})
class Example {
  readonly publish = createDateInputController()
}

export { Example }
