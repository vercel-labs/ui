import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/solid/combobox"
import { createSignal, For } from "solid-js"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "solidstart", label: "SolidStart" },
  { value: "qwik", label: "Qwik City" },
]

const modes = [
  { value: false, label: "Non-modal" },
  { value: "pointer", label: "Pointer" },
  { value: true, label: "Modal" },
] as const

export function Example() {
  const [modal, setModal] = createSignal<boolean | "pointer">(false)
  const [presses, setPresses] = createSignal(0)

  return (
    <div data-slot="stack">
      <div role="group" aria-label="Modal" data-slot="row">
        <For each={modes}>
          {(mode) => (
            <button
              type="button"
              aria-pressed={modal() === mode.value ? "true" : "false"}
              onClick={() => setModal(mode.value)}
            >
              {mode.label}
            </button>
          )}
        </For>
      </div>
      <Combobox modal={modal()}>
        <div data-slot="stack">
          <ComboboxLabel>Framework</ComboboxLabel>
          <div data-slot="row">
            <ComboboxInput placeholder="Select a framework" />
            <ComboboxTrigger aria-label="Show frameworks">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </ComboboxTrigger>
          </div>
        </div>
        <ComboboxContent>
          <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
          <ComboboxList>
            <For each={frameworks}>
              {(framework) => (
                <ComboboxItem value={framework.value} label={framework.label}>
                  {framework.label}
                  <ComboboxItemIndicator>
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
                  </ComboboxItemIndicator>
                </ComboboxItem>
              )}
            </For>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <button type="button" onClick={() => setPresses((count) => count + 1)}>
        Pressed {presses()} times
      </button>
    </div>
  )
}
