import { Component } from "@angular/core"
import { LucideEye, LucideEyeOff } from "@lucide/angular"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/angular/password-input"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldLabel,
    PasswordInput,
    PasswordInputControl,
    PasswordInputToggle,
    LucideEye,
    LucideEyeOff,
  ],
  template: `
    <div dir="rtl">
      <div uiField name="password">
        <label uiFieldLabel>كلمة المرور</label>
        <div uiPasswordInput>
          <input uiPasswordInputControl />
          <button
            uiPasswordInputToggle
            #passwordInputToggle="uiPasswordInputToggle"
            aria-label="إظهار كلمة المرور"
          >
            @if (passwordInputToggle.state().visible) {
              <svg lucideEyeOff></svg>
            } @else {
              <svg lucideEye></svg>
            }
          </button>
        </div>
        <p uiFieldDescription>ثمانية أحرف على الأقل.</p>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
