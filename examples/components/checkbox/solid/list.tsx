import { Checkbox, CheckboxIndicator } from "@ui-sdk/solid/checkbox"
import { For } from "solid-js"

const items = [
  { value: "hard-disks", label: "Hard disks", checked: false },
  { value: "external-disks", label: "External disks", checked: true },
  { value: "media", label: "CDs, DVDs and iPods", checked: true },
  { value: "servers", label: "Connected servers", checked: false },
]

function Example() {
  return (
    <fieldset data-slot="stack">
      <legend>Show these items on the desktop</legend>
      <p data-slot="hint">Select the items you want to show on the desktop.</p>
      <For each={items}>
        {(item) => (
          <label data-slot="label">
            <Checkbox name="desktop" value={item.value} defaultChecked={item.checked}>
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
            {item.label}
          </label>
        )}
      </For>
    </fieldset>
  )
}

export { Example }
