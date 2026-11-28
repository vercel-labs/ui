import { Component } from "@angular/core"
import { LucideEye, LucideEyeOff } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  createPasswordInputController,
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
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="suggest()">Suggest</button>
        <button type="button" (click)="password.toggleVisible()">Toggle</button>
        <button type="button" (click)="password.clear()">Clear</button>
        <button type="button" (click)="read()">Read</button>
        <button type="button" (click)="password.focus()">Focus</button>
      </div>
      <div uiField name="new-password">
        <label uiFieldLabel>New password</label>
        <div
          uiPasswordInput
          [controller]="password"
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
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly password = createPasswordInputController()

  suggest() {
    this.password.setValue("plum-kettle-orbit-42")
    this.password.setVisible(true)
  }

  read() {
    this.log(
      `${this.password.getValue().length} characters, ${this.password.isVisible() ? "shown" : "hidden"}`
    )
  }
}

export { Example }
