import { Component } from "@angular/core"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"

@Component({
  imports: [Field, FieldDescription, FieldLabel, FieldLegend, FieldSet, Input],
  template: `
    <fieldset uiFieldSet dir="rtl">
      <legend uiFieldLegend>العنوان</legend>
      <p uiFieldDescription>نحتاج عنوانك لتوصيل طلبك.</p>
      <div uiField name="street">
        <label uiFieldLabel>الشارع</label>
        <input uiInput />
      </div>
      <div uiField name="city">
        <label uiFieldLabel>المدينة</label>
        <input uiInput />
      </div>
    </fieldset>
  `,
})
class Example {}

export { Example }
