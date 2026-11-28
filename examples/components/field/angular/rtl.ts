import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"

@Component({
  imports: [
    Checkbox,
    CheckboxIndicator,
    Field,
    FieldDescription,
    FieldLabel,
    Input,
    LucideCheck,
  ],
  template: `
    <div data-slot="stack" dir="rtl">
      <div uiField>
        <label uiFieldLabel>الاسم على البطاقة</label>
        <input
          uiInput
          name="card-name"
          autocomplete="cc-name"
          placeholder="ليلى حسن"
        />
      </div>
      <div uiField>
        <label uiFieldLabel>رقم البطاقة</label>
        <input
          uiInput
          name="card-number"
          inputmode="numeric"
          autocomplete="cc-number"
          placeholder="1234 5678 9012 3456"
        />
        <p uiFieldDescription>أدخل الرقم المكون من 16 خانة.</p>
      </div>
      <div uiField>
        <button uiCheckbox name="save-card" defaultChecked>
          <span uiCheckboxIndicator>
            <svg lucideCheck></svg>
          </span>
        </button>
        <label uiFieldLabel>احفظ البطاقة للمدفوعات القادمة</label>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
