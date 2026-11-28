import { Component } from "@angular/core"
import { DateInput } from "@ui-sdk/angular/date-input"
import { Field, FieldLabel } from "@ui-sdk/angular/field"

@Component({
  imports: [DateInput, Field, FieldLabel],
  template: `
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>Date (en-GB)</label>
        <div uiDateInput locale="en-GB" defaultValue="2026-11-02"></div>
      </div>
      <div uiField>
        <label uiFieldLabel>Datum (de-DE)</label>
        <div uiDateInput locale="de-DE" defaultValue="2026-11-02"></div>
      </div>
      <div uiField>
        <label uiFieldLabel>日付 (ja-JP)</label>
        <div uiDateInput locale="ja-JP" defaultValue="2026-11-02"></div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
