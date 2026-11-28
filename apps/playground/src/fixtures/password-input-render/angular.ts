import { Component } from "@angular/core"
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/angular/password-input"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [PasswordInput, PasswordInputControl, PasswordInputToggle],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiPasswordInput
        class="password-input"
        (visibleChange)="action.set('visible: ' + $event)"
      >
        <input uiPasswordInputControl class="input" aria-label="Password" />
        <span
          uiPasswordInputToggle
          #toggle="uiPasswordInputToggle"
          class="password-toggle"
          aria-label="Show password"
          [class.is-visible]="toggle.state().visible"
          [class.is-hidden]="!toggle.state().visible"
        >
          <span aria-hidden="true">{{
            toggle.state().visible ? "Hide" : "Show"
          }}</span>
        </span>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly action = state("")
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
