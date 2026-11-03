import { TokenInput, TokenInputEditor, type TokenInputValue } from "@ui-sdk/solid/token-input"
import { createSignal, createUniqueId } from "solid-js"

const draft: TokenInputValue = [
  "Explain ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " in two sentences.",
]

export function Example() {
  const [submitted, setSubmitted] = createSignal("")
  const [disabled, setDisabled] = createSignal(false)
  const [readOnly, setReadOnly] = createSignal(false)
  const formId = createUniqueId()
  return (
    <div data-slot="stack">
      <div data-slot="row">
        <label data-slot="label">
          <input
            type="checkbox"
            checked={disabled()}
            onChange={(event) => setDisabled(event.currentTarget.checked)}
          />
          Disabled
        </label>
        <label data-slot="label">
          <input
            type="checkbox"
            checked={readOnly()}
            onChange={(event) => setReadOnly(event.currentTarget.checked)}
          />
          Read-only
        </label>
      </div>
      <TokenInput
        form={formId}
        name="prompt"
        required
        defaultValue={draft}
        disabled={disabled()}
        readOnly={readOnly()}
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
        <p data-slot="output">{submitted()}</p>
      </form>
    </div>
  )
}
