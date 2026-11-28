import { Component } from "@angular/core"
import { LucideEye, LucideEyeOff } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/angular/password-input"

@Component({
  imports: [
    Field,
    FieldLabel,
    Input,
    PasswordInput,
    PasswordInputControl,
    PasswordInputToggle,
    LucideEye,
    LucideEyeOff,
  ],
  template: `
    <div data-slot="stack">
      <form data-slot="stack" id="sign-in" (submit)="onSubmit($event)">
        <div uiField name="email">
          <label uiFieldLabel>Email</label>
          <input uiInput type="email" required autocomplete="username" />
        </div>
      </form>
      <div uiField>
        <label uiFieldLabel>Password</label>
        <div uiPasswordInput name="password" form="sign-in" required>
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
      <div data-slot="row">
        <button type="submit" form="sign-in" data-variant="solid">
          Sign In
        </button>
        <button type="reset" form="sign-in">Reset</button>
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const data = new FormData(event.currentTarget as HTMLFormElement)
    const length = String(data.get("password")).length
    this.log(
      `Signed in as ${data.get("email")}, with a password of ${length} characters`
    )
  }
}

export { Example }
