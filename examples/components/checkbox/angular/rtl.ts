import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"

@Component({
  imports: [Checkbox, CheckboxIndicator, LucideCheck],
  template: `
    <div data-slot="stack" dir="rtl">
      <label data-slot="label">
        <button uiCheckbox>
          <span uiCheckboxIndicator>
            <svg lucideCheck></svg>
          </span>
        </button>
        قبول الشروط والأحكام
      </label>
      <label data-slot="label">
        <button uiCheckbox defaultChecked>
          <span uiCheckboxIndicator>
            <svg lucideCheck></svg>
          </span>
        </button>
        تفعيل الإشعارات
      </label>
    </div>
  `,
})
class Example {}

export { Example }
