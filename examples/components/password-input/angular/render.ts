import { Component } from "@angular/core"
import { LucideEye, LucideEyeOff } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/angular/password-input"

@Component({
  imports: [
    Field,
    FieldLabel,
    PasswordInput,
    PasswordInputControl,
    PasswordInputToggle,
    LucideEye,
    LucideEyeOff,
  ],
  template: `
    <div uiField name="password">
      <label uiFieldLabel>Password</label>
      <div uiPasswordInput>
        <input uiPasswordInputControl />
        <button
          uiPasswordInputToggle
          #passwordInputToggle="uiPasswordInputToggle"
          aria-label="Show password"
        >
          @if (passwordInputToggle.state().visible) {
            <svg lucideEyeOff></svg>
          } @else {
            <svg lucideEye></svg>
          }
        </button>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
