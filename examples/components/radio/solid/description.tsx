import { createUniqueId } from "solid-js"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { For } from "solid-js"

const options = [
  { value: "default", label: "Default", description: "Standard spacing for most use cases." },
  { value: "comfortable", label: "Comfortable", description: "More space between elements." },
  { value: "compact", label: "Compact", description: "Minimal spacing for dense layouts." },
]

function Example() {
  const id = createUniqueId()
  return (
    <RadioGroup defaultValue="comfortable" aria-label="Density">
      <For each={options}>
        {(option) => (
          <div data-slot="row">
            <Radio
              value={option.value}
              id={`${id}-density-${option.value}`}
              aria-describedby={`${id}-density-${option.value}-description`}
            >
              <RadioIndicator />
            </Radio>
            <div data-slot="stack">
              <label data-slot="label" for={`${id}-density-${option.value}`}>
                {option.label}
              </label>
              <p data-slot="hint" id={`${id}-density-${option.value}-description`}>
                {option.description}
              </p>
            </div>
          </div>
        )}
      </For>
    </RadioGroup>
  )
}

export { Example }
