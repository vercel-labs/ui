import { TokenInput, TokenInputEditor, type TokenInputValue } from "@ui-sdk/react/token-input"
import * as React from "react"

const draft: TokenInputValue = [
  "Explain ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " in two sentences.",
]

export function Example() {
  const [submitted, setSubmitted] = React.useState("")
  const [disabled, setDisabled] = React.useState(false)
  const [readOnly, setReadOnly] = React.useState(false)
  const formId = React.useId()
  return (
    <div data-slot="stack">
      <div data-slot="row">
        <label data-slot="label">
          <input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} />
          Disabled
        </label>
        <label data-slot="label">
          <input type="checkbox" checked={readOnly} onChange={(event) => setReadOnly(event.target.checked)} />
          Read-only
        </label>
      </div>
      <TokenInput
        form={formId}
        name="prompt"
        required
        defaultValue={draft}
        disabled={disabled}
        readOnly={readOnly}
      >
        <label id={`${formId}-label`} data-slot="label">
          Prompt
        </label>
        <TokenInputEditor aria-labelledby={`${formId}-label`} />
      </TokenInput>
      <form
        onReset={() => setSubmitted("")}
        id={formId}
        data-slot="stack"
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(String(new FormData(event.currentTarget).get("prompt") ?? ""))
        }}
      >
        <div data-slot="row">
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>
        <p data-slot="output">{submitted}</p>
      </form>
    </div>
  )
}
