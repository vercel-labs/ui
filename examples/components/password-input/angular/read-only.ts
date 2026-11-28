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
    <div uiField name="recovery-key">
      <label uiFieldLabel>Recovery key</label>
      <div
        uiPasswordInput
        readOnly
        defaultValue="7Hq2-vX9p-Lm4c"
        autoComplete="off"
      >
        <input uiPasswordInputControl />
        <button
          uiPasswordInputToggle
          #passwordInputToggle="uiPasswordInputToggle"
          aria-label="Show recovery key"
        >
          @if (passwordInputToggle.state().visible) {
            <svg lucideEyeOff></svg>
          } @else {
            <svg lucideEye></svg>
          }
        </button>
      </div>
      <p uiFieldDescription>
        Keep it somewhere safe. You can show it, but not change it.
      </p>
    </div>
  `,
})
class Example {}

export { Example }
