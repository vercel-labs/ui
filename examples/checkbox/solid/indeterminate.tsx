import { Checkbox, CheckboxIndicator } from "@ui-sdk/solid/checkbox"

function Example() {
  return (
    <label data-slot="label">
      <Checkbox defaultChecked="indeterminate">
        <CheckboxIndicator
          render={(props, state) => (
            <span {...props}>
              {state.indeterminate ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                </svg>
              ) : (
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
              )}
            </span>
          )}
        />
      </Checkbox>
      All notifications
    </label>
  )
}

export { Example }
