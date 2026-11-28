import { Component } from "@angular/core"
import { LucideX } from "@lucide/angular"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import { Input, InputClear, InputGroup } from "@ui-sdk/angular/input"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldLabel,
    Input,
    InputClear,
    InputGroup,
    LucideX,
  ],
  template: `
    <div data-slot="stack" dir="rtl">
      <div uiField name="name">
        <label uiFieldLabel>الاسم الكامل</label>
        <input uiInput placeholder="ليلى حسن" />
        <p uiFieldDescription>كما يظهر في ملفك الشخصي.</p>
      </div>
      <div uiInputGroup>
        <input uiInput type="search" aria-label="بحث" defaultValue="حسن" />
        <button *uiInputClear aria-label="مسح البحث">
          <svg lucideX></svg>
        </button>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
