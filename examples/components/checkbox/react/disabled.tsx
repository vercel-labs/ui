import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { CheckIcon } from "lucide-react"

function Example() {
  return (
    <div data-slot="stack">
      <label data-slot="label">
        <Checkbox defaultChecked disabled>
          <CheckboxIndicator>
            <CheckIcon aria-hidden="true" />
          </CheckboxIndicator>
        </Checkbox>
        Security alerts
      </label>
      <label data-slot="label">
        <Checkbox disabled>
          <CheckboxIndicator>
            <CheckIcon aria-hidden="true" />
          </CheckboxIndicator>
        </Checkbox>
        Enable notifications
      </label>
    </div>
  )
}

export { Example }
