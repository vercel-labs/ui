import { Component, computed, signal } from "@angular/core"
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
    <div uiField name="new-password">
      <label uiFieldLabel>New password</label>
      <div uiPasswordInput [(value)]="value" autoComplete="new-password">
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
      <div data-slot="strength" aria-hidden="true">
        @for (level of levels; track level) {
          <div [attr.data-on]="score() >= level || null"></div>
        }
      </div>
      <output data-slot="output">{{ summary() }}</output>
    </div>
  `,
})
class Example {
  readonly levels = [1, 2, 3, 4]

  readonly value = signal("")

  readonly score = computed(
    () =>
      [
        this.value().length >= 8,
        this.value().length >= 12,
        /[a-z]/.test(this.value()) && /[A-Z]/.test(this.value()),
        /\d/.test(this.value()) && /[^a-zA-Z\d]/.test(this.value()),
      ].filter(Boolean).length
  )

  readonly summary = computed(() =>
    this.value()
      ? `Strength: ${["Weak", "Weak", "Fair", "Good", "Strong"][this.score()]} (${this.value().length} characters)`
      : "Type a password to rate it."
  )
}

export { Example }
