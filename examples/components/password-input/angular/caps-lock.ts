import { Component } from "@angular/core"
import { LucideEye, LucideEyeOff, LucideLock } from "@lucide/angular"
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
    LucideLock,
  ],
  template: `
    <div uiField name="password">
      <label uiFieldLabel>Password</label>
      <div uiPasswordInput #passwordInput="uiPasswordInput">
        <input uiPasswordInputControl />
        <span>
          @if (passwordInput.state().capsLock) {
            <svg lucideLock></svg>
          }
        </span>
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
      <p data-slot="caps-lock">Caps Lock is on.</p>
    </div>
  `,
})
class Example {}

export { Example }
