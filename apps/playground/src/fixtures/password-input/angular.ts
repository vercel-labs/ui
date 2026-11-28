import { Component } from "@angular/core"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import {
  createPasswordInputController,
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
  type PasswordInputVisibleChange,
} from "@ui-sdk/angular/password-input"
import {
  passwordInputAction,
  passwordInputFixture,
  passwordInputOptions,
} from "../../../../../tests/fixtures/password-input"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldLabel,
    PasswordInput,
    PasswordInputControl,
    PasswordInputToggle,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="password-form"
        [attr.aria-label]="f.form.label"
        (submit)="onSubmit($event)"
      >
        <fieldset>
          <legend>{{ f.form.account }}</legend>
          <label>
            {{ f.email.label }}
            <input
              class="input"
              [name]="f.email.name"
              [defaultValue]="f.email.defaultValue"
            />
          </label>
          <div uiField>
            <label uiFieldLabel>{{ f.password.label }}</label>
            <div
              uiPasswordInput
              class="password-input"
              [name]="f.password.name"
              [controller]="reveal"
              [disabled]="options.disabled"
              [readOnly]="options.readOnly"
              [autoComplete]="options.autoComplete"
              [visible]="options.controlled ? visible() : undefined"
              [defaultVisible]="
                options.controlled ? undefined : options.defaultVisible
              "
              (beforeVisibleChange)="onVisibleChange($event)"
            >
              <input uiPasswordInputControl class="input" />
              <button
                uiPasswordInputToggle
                class="password-toggle"
                [attr.aria-label]="f.password.toggle"
              >
                <span aria-hidden="true">👁</span>
              </button>
            </div>
            <p uiFieldDescription>{{ f.password.description }}</p>
          </div>
          <p class="caps-lock">{{ f.password.capsLock }}</p>
        </fieldset>
        <button type="submit">{{ f.form.submit }}</button>
        <button type="reset">{{ f.form.reset }}</button>
      </form>
      <button (click)="reveal.toggleVisible()">{{ f.controller }}</button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = passwordInputFixture
  readonly options = passwordInputOptions()
  readonly reveal = createPasswordInputController()
  readonly action = state("")
  readonly visible = state(!!this.options.defaultVisible)

  onVisibleChange(change: PasswordInputVisibleChange) {
    if (this.options.cancel) {
      return change.cancel()
    }
    this.visible.set(change.value)
    this.action.set(passwordInputAction.visible(change.value, change.reason))
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const field = (event.currentTarget as HTMLFormElement).elements.namedItem(
      passwordInputFixture.password.name
    ) as HTMLInputElement
    this.action.set(passwordInputAction.submit(field.type))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
