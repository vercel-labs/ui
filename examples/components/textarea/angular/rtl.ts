import { Component } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import { Textarea } from "@ui-sdk/angular/textarea"

@Component({
  imports: [Field, FieldDescription, FieldLabel, Textarea],
  template: `
    <div uiField dir="rtl" name="feedback">
      <label uiFieldLabel>ملاحظاتك</label>
      <textarea uiTextarea autoResize placeholder="أخبرنا برأيك…"></textarea>
      <p uiFieldDescription>نقرأ كل رسالة.</p>
    </div>
  `,
})
class Example {}

export { Example }
