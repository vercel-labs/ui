import { Component } from "@angular/core"
import { DateInput, DateInputSegment } from "@ui-sdk/angular/date-input"
import { Field, FieldLabel } from "@ui-sdk/angular/field"

@Component({
  imports: [DateInput, DateInputSegment, Field, FieldLabel],
  template: `
    <div uiField>
      <label uiFieldLabel>Start date</label>
      <div uiDateInput #dateInput="uiDateInput" defaultValue="2026-11-02">
        @for (segment of dateInput.state().segments; track segment.key) {
          @if (segment.editable) {
            <input uiDateInputSegment [segment]="segment" />
          } @else {
            <span uiDateInputSegment [segment]="segment">–</span>
          }
        }
      </div>
    </div>
  `,
})
class Example {}

export { Example }
