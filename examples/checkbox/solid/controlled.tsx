import { createCheckboxController, type CheckedState } from "@ui-sdk/core/checkbox"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/solid/checkbox"
import { createSignal } from "solid-js"

function Example() {
  const updates = createCheckboxController()
  const [checked, setChecked] = createSignal<CheckedState>(false)
  const [reason, setReason] = createSignal("")

  return (
    <div data-slot="stack">
      <label data-slot="label">
        <Checkbox
          checked={checked()}
          onCheckedChange={(next, details) => {
            setChecked(next)
            setReason(details.reason)
          }}
          controller={updates}
        >
          <CheckboxIndicator>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </CheckboxIndicator>
        </Checkbox>
        Email me about product updates
      </label>
      <button type="button" onClick={() => updates.toggle()}>
        Toggle from outside
      </button>
      <output data-slot="output">
        Checked: {String(checked())}
        {reason() && `, last change: ${reason()}`}
      </output>
    </div>
  )
}

export { Example }
