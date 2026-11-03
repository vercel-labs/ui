import { Toggle, ToggleGroup } from "@ui-sdk/solid/toggle"
import { createSignal, For } from "solid-js"

const weights = [
  { value: "light", label: "Light" },
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "bold", label: "Bold" },
]

function Example() {
  const [weight, setWeight] = createSignal("normal")

  return (
    <div data-slot="stack">
      <ToggleGroup
        defaultValue={["normal"]}
        deselectable={false}
        aria-label="Font weight"
        onValueChange={(value) => setWeight(value[0] ?? "normal")}
      >
        <For each={weights}>
          {(item) => (
            <Toggle value={item.value} data-variant={item.value}>
              {item.label}
            </Toggle>
          )}
        </For>
      </ToggleGroup>
      <p data-variant={weight()}>The quick brown fox jumps over the lazy dog.</p>
    </div>
  )
}

export { Example }
