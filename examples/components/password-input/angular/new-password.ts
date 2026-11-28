import { Component, signal } from "@angular/core"
import { LucideCheck, LucideEye, LucideEyeOff, LucideX } from "@lucide/angular"
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
    LucideCheck,
    LucideEye,
    LucideEyeOff,
    LucideX,
  ],
  template: `
    <div uiField name="new-password">
      <label uiFieldLabel>Create a password</label>
      <div
        uiPasswordInput
        [value]="password()"
        autoComplete="new-password"
        (beforeValueChange)="password.set($event.value)"
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
      <ul data-slot="stack" aria-label="Password requirements">
        @for (rule of rules; track rule.label) {
          @if (rule.test(password())) {
            <li data-slot="row">
              <svg lucideCheck></svg>
              <span data-slot="visually-hidden">Done:</span>
              {{ rule.label }}
            </li>
          } @else {
            <li data-slot="row">
              <svg lucideX></svg>
              <span data-slot="visually-hidden">To do:</span>
              {{ rule.label }}
            </li>
          }
        }
      </ul>
    </div>
  `,
})
class Example {
  readonly rules = [
    {
      label: "At least 8 characters",
      test: (password: string) => this.password().length >= 8,
    },
    {
      label: "A number",
      test: (password: string) => /\d/.test(this.password()),
    },
    {
      label: "An uppercase and a lowercase letter",
      test: (password: string) =>
        /[a-z]/.test(this.password()) && /[A-Z]/.test(this.password()),
    },
  ]

  readonly password = signal("")
}

export { Example }
