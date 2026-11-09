import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/solid/password-input"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"

function Fixture() {
  const [action, setAction] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <PasswordInput
        class="password-input"
        onVisibleChange={(visible) => setAction(`visible: ${visible}`)}
      >
        <PasswordInputControl class="input" aria-label="Password" />
        <PasswordInputToggle
          aria-label="Show password"
          render={(props) => <span {...props} />}
          class={(state) =>
            `password-toggle ${state.visible ? "is-visible" : "is-hidden"}`
          }
        >
          {(state) => (
            <span aria-hidden="true">{state.visible ? "Hide" : "Show"}</span>
          )}
        </PasswordInputToggle>
      </PasswordInput>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
