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
} from "@ui-sdk/react/combobox"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import * as React from "react"

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
  const [modal, setModal] = React.useState<boolean | "pointer">(false)
  const [presses, setPresses] = React.useState(0)

  return (
    <div data-slot="stack">
      <div role="group" aria-label="Modal" data-slot="row">
        {modes.map((mode) => (
          <button
            key={mode.label}
            type="button"
            aria-pressed={modal === mode.value}
            onClick={() => setModal(mode.value)}
          >
            {mode.label}
          </button>
        ))}
      </div>
      <Combobox modal={modal}>
        <div data-slot="stack">
          <ComboboxLabel>Framework</ComboboxLabel>
          <div data-slot="row">
            <ComboboxInput placeholder="Select a framework" />
            <ComboboxTrigger aria-label="Show frameworks">
              <ChevronDownIcon />
            </ComboboxTrigger>
          </div>
        </div>
        <ComboboxContent>
          <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
          <ComboboxList>
            {frameworks.map((framework) => (
              <ComboboxItem key={framework.value} value={framework.value} label={framework.label}>
                {framework.label}
                <ComboboxItemIndicator>
                  <CheckIcon />
                </ComboboxItemIndicator>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <button type="button" onClick={() => setPresses((count) => count + 1)}>
        Pressed {presses} times
      </button>
    </div>
  )
}
