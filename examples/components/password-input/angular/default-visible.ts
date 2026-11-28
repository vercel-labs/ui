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
    <div uiField name="wifi-password">
      <label uiFieldLabel>Wi-Fi password</label>
      <div
        uiPasswordInput
        defaultVisible
        defaultValue="maple-orbit-42"
        autoComplete="new-password"
      >
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
      <p uiFieldDescription>Guests read it from here, so it starts shown.</p>
    </div>
  `,
})
class Example {}

export { Example }
