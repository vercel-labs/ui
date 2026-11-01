import { createUniqueId } from "solid-js"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { createSignal, For, Show } from "solid-js"

const methods = [
  { value: "standard", label: "Standard", detail: "Free, 5 to 7 days" },
  { value: "express", label: "Express", detail: "$9, 2 days" },
  { value: "overnight", label: "Overnight", detail: "$24, next day" },
]

function Example() {
  const id = createUniqueId()
  const [submitted, setSubmitted] = createSignal("")

  return (
    <div data-slot="stack">
      <RadioGroup
        aria-label="Shipping"
        name="shipping"
        form={`${id}-shipping-form`}
        required
        defaultValue="standard"
      >
        <For each={methods}>
          {(method) => (
            <label data-slot="label">
              <Radio value={method.value}>
                <RadioIndicator />
              </Radio>
              {method.label} <span data-slot="hint">{method.detail}</span>
            </label>
          )}
        </For>
      </RadioGroup>
      <form
        data-slot="row"
        id={`${id}-shipping-form`}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))))
        }}
        onReset={() => setSubmitted("")}
      >
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <Show when={submitted()}>
        <output data-slot="output">Submitted: {submitted()}</output>
      </Show>
    </div>
  )
}

export { Example }
