import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/react/password-input"
import * as React from "react"
import { createRoot } from "react-dom/client"

function Fixture() {
  const [action, setAction] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <PasswordInput
        className="password-input"
        onVisibleChange={(visible) => setAction(`visible: ${visible}`)}
      >
        <PasswordInputControl className="input" aria-label="Password" />
        <PasswordInputToggle
          aria-label="Show password"
          render={<span />}
          className={(state) =>
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
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { mount }
