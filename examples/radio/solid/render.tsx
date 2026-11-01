import { createUniqueId } from "solid-js"
import { Radio, RadioGroup } from "@ui-sdk/solid/radio"
import { For, Show } from "solid-js"

const icon = (markup: string) => () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    innerHTML={markup}
  />
)
const Bell = icon(
  '<path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />',
)
const Mail = icon(
  '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" />',
)
const Moon = icon(
  '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />',
)

const options = [
  { value: "all", label: "Everything", description: "Every message and update.", icon: Bell },
  { value: "mentions", label: "Mentions", description: "Only when someone mentions you.", icon: Mail },
  { value: "none", label: "Nothing", description: "Turn notifications off.", icon: Moon },
]

function Example() {
  const id = createUniqueId()
  return (
    <RadioGroup aria-label="Notify me about" defaultValue="mentions">
      <For each={options}>
        {(option) => (
          <Radio
            value={option.value}
            aria-labelledby={`${id}-notify-${option.value}-label`}
            aria-describedby={`${id}-notify-${option.value}-description`}
            render={(props, state) => (
              <button {...props}>
                <option.icon />
                <span data-slot="stack">
                  <span id={`${id}-notify-${option.value}-label`}>{props.children}</span>
                  <span data-slot="hint" id={`${id}-notify-${option.value}-description`}>
                    {option.description}
                  </span>
                </span>
                <Show when={state.checked}>
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
                </Show>
              </button>
            )}
          >
            {option.label}
          </Radio>
        )}
      </For>
    </RadioGroup>
  )
}

export { Example }
